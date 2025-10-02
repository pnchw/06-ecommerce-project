"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import LoadingPage from "@/components/Loading";
import CartItemsTable from "@/components/cart/CartItemsTable";
import CartSummaryCard from "@/components/cart/CartSummaryCard";

export default function CartPage() {
	const { cart, isLoading, removeFromCart, clearCart, updateItemQuantity } =
		useCart();
	const router = useRouter();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader className="w-10 h-10 animate-spin text-blue-600" />
			</div>
		);
	}

	if (!cart || cart.length === 0) {
		return <LoadingPage page="Your cart is empty." />;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 mt-15">
			<h1 className="text-3xl font-bold mb-8 text-center md:text-left">
				Shopping Cart
			</h1>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<CartItemsTable
					cart={cart}
					updateItemQuantity={updateItemQuantity}
					removeFromCart={removeFromCart}
				/>
				<CartSummaryCard cart={cart} router={router} clearCart={clearCart} />
			</div>
		</div>
	);
}
