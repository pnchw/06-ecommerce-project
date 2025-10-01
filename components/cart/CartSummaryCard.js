"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CartSummaryCard({ cart, router, clearCart }) {
	const itemsPrice = cart.reduce((total, item) => {
		return total + Number(item.price) * item.quantity;
	}, 0);
	const shippingPrice = itemsPrice > 150 ? 0 : 35;
	const totalPrice = itemsPrice + shippingPrice;

	return (
		<Card className="shadow-lg rounded-lg border border-gray-200">
			<CardContent className="p-6 space-y-4">
				<h2 className="text-2xl font-semibold border-b pb-2">Order Summary</h2>
				<div className="flex justify-between text-lg">
					<span>Subtotal</span>
					<span>฿{itemsPrice}</span>
				</div>
				<div className="flex justify-between text-lg">
					<span>Shipping</span>
					<span
						className={
							shippingPrice === 0 ? "text-green-600 font-semibold" : ""
						}
					>
						{shippingPrice === 0 ? "Free" : `฿${shippingPrice}`}
					</span>
				</div>
				<div className="flex justify-between text-xl font-bold border-t pt-3">
					<span>Total</span>
					<span>฿{totalPrice}</span>
				</div>

				<div className="flex flex-col space-y-3 mt-6">
					<Button
						className="w-full relative font-semibold py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 shadow-md transition active:scale-95 active:brightness-90 cursor-pointer"
						onClick={() => router.push("/address")}
						aria-label="Proceed to checkout"
					>
						Checkout
					</Button>
					<Button
						className="w-full bg-red-500 text-white font-semibold py-3 shadow-md hover:bg-red-600 transition active:scale-95 active:brightness-90 cursor-pointer"
						onClick={() => {
							clearCart();
						}}
						aria-label="Clear cart"
					>
						Clear Cart
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
