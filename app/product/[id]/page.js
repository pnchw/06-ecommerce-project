"use client";

import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
	const params = useParams();
	const { addToCart } = useCart();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [currentIndex, setCurrentIndex] = useState(0);
	const router = useRouter();

	// Fetch product data when params.id is available
	useEffect(() => {
		if (!params.id) return;
		async function fetchProduct() {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`
				);
				if (!res.ok) throw new Error("Failed to fetch product");
				const data = await res.json();
				setProduct(data);
				setCurrentIndex(0);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchProduct();
	}, [params.id]);

	//call cart api and add item to cart
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

	// handle quantity
	const increaseQty = () => setQuantity((prev) => prev + 1);
	const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	const nextImage = () => {
		setCurrentIndex((prev) =>
			prev === product.images.length - 1 ? 0 : prev + 1
		);
	};

	const prevImage = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? product.images.length - 1 : prev - 1
		);
	};

	// Handle loading and error states
	if (loading) return <p className="text-center mt-10">Loading...</p>;
	if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
	if (!product) return <p className="text-center mt-10">Product not found</p>;

	return (
		<div className="max-w-6xl mx-auto p-8 md:p-20 mt-10 flex flex-col md:flex-row gap-10">
			{/* Image Section */}
			<section className="md:w-1/2 flex flex-col items-center">
				{/* Main Image */}
				<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-100">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.4 }}
							className="absolute inset-0"
						>
							<Image
								src={product.images[currentIndex]}
								alt={product.name}
								fill
								className="object-cover w-full h-full rounded-lg"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
						</motion.div>
					</AnimatePresence>

					{/* Prev Button */}
					<button
						onClick={prevImage}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md backdrop-blur-sm p-3 rounded-full hover:bg-amber-500 hover:text-white active:scale-90 active:brightness-90 transition w-12 h-12 cursor-pointer flex items-center justify-center"
					>
						◀
					</button>

					{/* Next Button */}
					<button
						onClick={nextImage}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md backdrop-blur-sm p-3 rounded-full hover:bg-amber-500 hover:text-white active:scale-90 active:brightness-90 transition w-12 h-12 cursor-pointer flex items-center justify-center"
					>
						▶
					</button>
				</div>

				{/* Thumbnail Gallery */}
				<div className="flex gap-4 mt-6">
					{product.images.map((img, idx) => (
						<motion.button
							key={idx}
							onClick={() => setCurrentIndex(idx)}
							className={`w-20 h-20 rounded-lg border-2 overflow-hidden shadow-sm cursor-pointer ${
								currentIndex === idx ? "border-blue-500" : "border-transparent"
							}`}
							whileHover={{ scale: 1.1 }} // ✅ now works
							whileTap={{ scale: 0.95 }} // optional
						>
							<Image
								src={img}
								alt={`Thumbnail ${idx + 1}`}
								width={80}
								height={80}
								className="object-cover w-full h-full"
							/>
						</motion.button>
					))}
				</div>
			</section>

			{/* Detail Section */}
			<section className="md:w-1/2 flex flex-col justify-between">
				<div>
					<h1 className="text-4xl font-bold mb-4">{product.name}</h1>
					<p className="text-gray-600 mb-6 leading-relaxed">
						{product.description}
					</p>
					<p className="text-3xl font-extrabold text-amber-500 mb-6">
						฿{product.price}
					</p>

					{/* Quantity Selector */}
					<div className="flex items-center space-x-4 mb-6">
						<p className="text-gray-700">Quantity</p>
						<button
							onClick={decreaseQty}
							disabled={quantity === 1}
							className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center text-xl font-bold cursor-pointer"
						>
							-
						</button>
						<span className="text-2xl font-semibold">{quantity}</span>
						<button
							onClick={increaseQty}
							disabled={quantity === product.stock}
							className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center text-xl font-bold cursor-pointer"
						>
							+
						</button>
						<p className="ml-6 text-gray-500 italic">
							{product.stock > 0
								? `In stock: ${product.stock}`
								: "Out of stock"}
						</p>
					</div>

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						disabled={product.stock === 0}
						className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 active:brightness-90 transition transform duration-150 disabled:opacity-50 cursor-pointer"
					>
						{product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
						<span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition duration-300"></span>
					</button>
				</div>
			</section>
		</div>
	);
}
