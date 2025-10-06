import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// GET: Get all cart items for the user
export async function GET() {
	try {
		const session = await auth();
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;

		if (!session?.user?.id && !sessionCartId) {
			return NextResponse.json({ cart: [] });
		}

		const cart = await prisma.cart.findFirst({
			where: session?.user?.id
				? { userId: session.user.id }
				: { sessionCartId: sessionCartId },
		});

		if (!cart || !cart?.items || cart?.items?.length === 0) {
			return NextResponse.json({ cart: [] });
		}

		// Fetch product details for each cart item
		const detailedItems = await Promise.all(
			cart.items.map(async (item) => {
				const product = await prisma.product.findUnique({
					where: { id: item.productId },
				});

				if (!product) return null;

				return {
					id: product.id,
					name: product.name,
					price: product.price,
					image: product.images,
					quantity: item.quantity,
					stock: product.stock ?? 0,
				};
			})
		);

		const filteredItems = detailedItems.filter((item) => item !== null);

		return NextResponse.json({
			cart: filteredItems,
			shippingPrice: cart.shippingPrice,
			totalPrice: cart.totalPrice,
		});
	} catch (error) {
		console.error("Error fetching cart:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST: Add items to cart
export async function POST(req) {
	try {
		const session = await auth();
		const { productId, quantity } = await req.json();
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		const userId = session?.user?.id;

		//manual validation. change to zod schema instead?
		if (!productId || !quantity || (!sessionCartId && !userId)) {
			return NextResponse.json(
				{ error: "Invalid input data" },
				{ status: 400 }
			);
		}

		//fetch product
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 400 });
		}

		const itemPrice = Number(product.price) * quantity;
		const shippingPrice = itemPrice > 150 ? 0 : 35;
		const totalPrice = itemPrice + shippingPrice;

		//find existing cart from db
		const cart = await prisma.cart.findFirst({
			where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
		});

		if (cart) {
			//check if there is already existing item in the cart
			let updatedItems = [...cart.items];
			const existingItem = cart.items.find(
				(item) => item.productId === productId
			);

			if (existingItem) {
				//check stock
				if (product.stock < existingItem.quantity + quantity) {
					return NextResponse.json(
						{ error: "Not enough stock" },
						{ status: 400 }
					);
				}
				//increase quantity
				updatedItems = cart.items.map((item) =>
					item.productId === productId
						? {
								...item,
								quantity: item.quantity + quantity,
								stock: product.stock,
						  }
						: item
				);
			} else {
				//check stock
				if (product.stock < quantity) {
					return NextResponse.json(
						{ error: "Not enough stock" },
						{ status: 400 }
					);
				}
				updatedItems = [
					...cart.items,
					{
						productId,
						quantity,
						name: product.name,
						image: product.images,
						price: product.price,
						stock: product.stock,
					},
				];
			}

			//update existing cart
			let newItemsPrice = 0;
			for (let item of updatedItems) {
				const productData = await prisma.product.findUnique({
					where: { id: item.productId },
				});

				if (productData) {
					newItemsPrice += Number(productData.price) * item.quantity;
				}
			}

			const newShippingPrice = newItemsPrice > 150 ? 0 : 35;
			const newTotalPrice = newItemsPrice + newShippingPrice;

			const updatedCart = await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: updatedItems,
					itemsPrice: newItemsPrice,
					shippingPrice: newShippingPrice,
					totalPrice: newTotalPrice,
				},
			});

			return NextResponse.json({
				cart: updatedCart,
				success: true,
				message: `${product.name} added to cart`,
			});
		} else {
			//create a new cart
			const newCart = await prisma.cart.create({
				data: {
					userId,
					sessionCartId: sessionCartId || "",
					items: [
						{
							productId,
							quantity,
							name: product.name,
							image: product.images,
							price: product.price,
							stock: product.stock,
						},
					],
					itemsPrice: itemPrice,
					shippingPrice: shippingPrice,
					totalPrice: totalPrice,
				},
			});

			return NextResponse.json({
				success: true,
				message: `${product.name} added to cart`,
				cart: newCart,
			});
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// PUT: Update item quantity
export async function PUT(req) {
	try {
		const session = await auth();
		const { productId, quantity } = await req.json();
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		const userId = session?.user?.id;

		if (!productId || quantity === undefined || (!sessionCartId && !userId)) {
			return NextResponse.json(
				{ error: "Invalid input data" },
				{ status: 400 }
			);
		}

		const cart = await prisma.cart.findFirst({
			where: userId ? { userId } : { sessionCartId },
		});

		if (!cart)
			return NextResponse.json(
				{ error: "Item not found in cart" },
				{ status: 404 }
			);

		let updatedItems = [...cart.items];
		const itemIndex = updatedItems.findIndex(
			(item) => item.productId === productId
		);

		if (itemIndex === -1) {
			return NextResponse.json(
				{ error: "Item not found in cart" },
				{ status: 404 }
			);
		}

		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 400 });
		}
		if (quantity > product.stock) {
			return NextResponse.json(
				{ error: "Not enough stock available" },
				{ status: 400 }
			);
		}

		if (quantity <= 0) {
			updatedItems.splice(itemIndex, 1);
		} else {
			updatedItems[itemIndex].quantity = quantity;
		}

		const itemsPrice = await calculateItemsPrice(updatedItems);
		const shippingPrice = 35;

		const updatedCart = await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: updatedItems,
				itemsPrice,
				shippingPrice,
				totalPrice: itemsPrice + shippingPrice,
			},
		});

		return NextResponse.json(updatedCart);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// DELETE: remove a single item or clear the cart
export async function DELETE(req) {
	try {
		const session = await auth();
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		const userId = session?.user?.id || undefined;

		if (!sessionCartId && !userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const cart = await prisma.cart.findFirst({
			where: userId ? { userId } : { sessionCartId },
		});

		if (!cart) {
			return NextResponse.json(
				{ message: "No cart to delete" },
				{ status: 404 }
			);
		}

		await prisma.cart.delete({
			where: { id: cart.id },
		});

		return NextResponse.json({ message: "Cart cleared" });
	} catch (error) {
		console.error("[CART DELETE]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// helper function to recalculate item price
async function calculateItemsPrice(items) {
	const prisma = new PrismaClient();
	let total = 0;

	for (let item of items) {
		const product = await prisma.product.findUnique({
			where: { id: item.productId },
		});
		if (product) {
			total += product.price * item.quantity;
		}
	}

	return total;
}
