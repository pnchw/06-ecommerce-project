"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";

export default function ProductDetailPage() {
	const params = useParams();
	const { addToCart } = useCart();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const router = useRouter();

	useEffect(() => {
		if (!params.id) return;
		async function fetchProduct() {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`,
					{ cache: "no-store" }
				);
				if (!res.ok) throw new Error("Failed to fetch product");
				const data = await res.json();
				setProduct(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchProduct();
	}, [params.id]);

	const handleAddToCart = async () => {
		if (!product) return;

		try {
			const res = await fetch("/api/cart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					productId: product.id,
					quantity,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);

			addToCart({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.images,
				quantity,
			});
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

	const increaseQty = () => setQuantity((prev) => prev + 1);
	const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	if (loading) return <p className="text-center mt-10">Loading...</p>;
	if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
	if (!product) return <p className="text-center mt-10">Product not found</p>;

	return (
		<div className="max-w-6xl mx-auto p-8 md:p-20 mt-10 flex flex-col md:flex-row gap-10">
			<ProductImages images={product.images} name={product.name} />
			<ProductInfo
				product={product}
				quantity={quantity}
				onIncrease={increaseQty}
				onDecrease={decreaseQty}
				onAddToCart={handleAddToCart}
			/>
		</div>
	);
}
