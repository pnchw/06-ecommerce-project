"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AddToCartButton({ product }) {
	const { addToCart } = useCart();
	const router = useRouter();
	const [clicked, setClicked] = useState(false);

	const handleAddToCart = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!product) return;

		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.images,
			quantity: 1,
		});

		setClicked(true);
		setTimeout(() => setClicked(false), 150);

		try {
			const res = await fetch("/api/cart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					productId: product.id,
					quantity: 1,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);

			toast(`${product.name} added to the cart`, {
				action: {
					label: "Go to cart",
					onClick: () => {
						setTimeout(() => {
							router.push("/cart");
						}, 1000);
					},
				},
			});
		} catch (error) {
			console.log("Error adding to cart:", error);
		}
	};

	return (
		<>
			<button
				onClick={handleAddToCart}
				className={`absolute bottom-4 right-4 p-2 rounded-full shadow-md cursor-pointer text-white transition-colors duration-150
       						 ${clicked ? "bg-amber-700" : "bg-amber-600 hover:bg-amber-500"}`}
				aria-label="Add to cart"
			>
				<ShoppingCart size={18} />
			</button>
		</>
	);
}
