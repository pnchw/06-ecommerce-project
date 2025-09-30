import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const orderId = searchParams.get("id");

		if (!orderId) {
			return NextResponse.json(
				{ error: "Missing orderId parameter" },
				{ status: 400 }
			);
		}

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				orderitems: true,
				user: { select: { name: true, email: true } },
			},
		});

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json({ order });
	} catch (error) {
		console.error("Fetch order error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	try {
		const session = await auth();
		if (!session) throw new Error("User is not authenticated");

		const userId = session?.user?.id;
		if (!userId) throw new Error("User not found");

		const user = await prisma.user.findFirst({
			where: { id: userId },
		});
		if (!user) throw new Error("User not found");

		if (!user.address) {
			return NextResponse.json(
				{ success: false, error: "No shipping address" },
				{ status: 400 }
			);
		}

		if (!user.paymentMethod) {
			return NextResponse.json(
				{ success: false, error: "No payment method" },
				{ status: 400 }
			);
		}

		const sessionCartId = (await cookies()).get("sessionCartId")?.value;

		if (!session?.user?.id && !sessionCartId) {
			return NextResponse.json({ cart: [] });
		}
		// get existing cart from db
		const cart = await prisma.cart.findFirst({
			where: session?.user?.id
				? { userId: session.user.id }
				: { sessionCartId: sessionCartId },
		});

		if (!cart || !cart.items || cart.items.length === 0) {
			return NextResponse.json(
				{ success: false, error: "Cart is empty" },
				{ status: 400 }
			);
		}

		// Create order in database
		const insertedOrderId = await prisma.$transaction(async (tx) => {
			// insert data to order table
			const insertedOrder = await tx.order.create({
				data: {
					userId: user.id,
					shippingAddress: user.address,
					paymentMethod: user.paymentMethod,
					itemsPrice: cart.itemsPrice,
					shippingPrice: cart.shippingPrice,
					totalPrice: cart.totalPrice,
				},
			});

			for (const item of cart.items) {
				await tx.orderItem.create({
					data: {
						order: { connect: { id: insertedOrder.id } },
						product: { connect: { id: item.productId } },
						qty: item.quantity,
						price: item.price,
						name: item.name,
						image: item.image?.[0] || "",
					},
				});
			}

			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					itemsPrice: 0,
					shippingPrice: 0,
					totalPrice: 0,
				},
			});

			return insertedOrder.id;
		});

		return NextResponse.json({
			success: true,
			message: "Order created successfully",
			redirectTo: `/order/${insertedOrderId}`,
			paymentMethod: user.paymentMethod,
		});
	} catch (error) {
		console.error("Order creation error:", error);
		return NextResponse.json(
			{ success: false, error: "Something went wrong" },
			{ status: 500 }
		);
	}
}