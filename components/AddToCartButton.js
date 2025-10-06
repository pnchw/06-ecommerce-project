"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { Loader, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";

export default function AddToCartButton({ product }) {
	const router = useRouter();
	const { addToCart, cart } = useCart();
	const [clicked, setClicked] = useState(false);
	const [loading, setLoading] = useState(false);

	const currentItem = useMemo(() => {
		return cart?.find((item) => item.id === product.id);
	}, [cart, product.id]);

	const currentQty = currentItem?.quantity || 0;
	const isOutOfStock = product.stock <= 0;
	const reachedMaxStock = currentQty >= product.stock;
	const isDisabled = loading || isOutOfStock || reachedMaxStock;

	const handleAddToCart = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		setLoading(true);

		try {
			const success = await addToCart({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.images,
				quantity: 1,
				stock: product.stock,
			});

			if (success) {
				setClicked(true);
				toast(`${product.name} added to the cart`, {
					action: {
						label: "Go to cart",
						onClick: () => router.push("/cart"),
					},
				});
				setTimeout(() => setClicked(false), 150);
			} else if (reachedMaxStock) {
				toast.error("Not enough stock available");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleAddToCart}
			className={`absolute bottom-4 right-4 p-2 rounded-full shadow-md text-white bg-amber-600 transition-transform duration-200 ease-out 
				
				${
					isOutOfStock
						? "opacity-70 cursor-not-allowed  bg-amber-700"
						: "hover:bg-amber-500 hover:scale-110 cursor-pointer"
				}${clicked ? "scale-90 bg-amber-700" : ""}`}
			aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
			title={isOutOfStock ? "Out of stock" : ""}
			disabled={isOutOfStock}
		>
			{loading ? (
				<Loader className="animate-spin" size={20} />
			) : isOutOfStock ? (
				<span className="text-sm font-semibold">Out of stock</span>
			) : (
				<ShoppingCart size={20} />
			)}
		</button>
	);
}
