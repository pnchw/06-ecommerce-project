"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import LoadingPage from "@/components/Loading";

export default function CartPage() {
	const { cart, isLoading, removeFromCart, clearCart, updateItemQuantity } =
		useCart();

	const router = useRouter();

	// Calculate item total
	const itemsPrice = cart.reduce((total, item) => {
		return total + Number(item.price) * item.quantity;
	}, 0);

	// Calculate shipping price (free if itemsPrice > 150)
	const shippingPrice = itemsPrice > 150 ? 0 : 35;

	// Calculate total price
	const totalPrice = itemsPrice + shippingPrice;

	const increaseQty = (id, currentQty) => {
		updateItemQuantity(id, currentQty + 1);
	};

	const decreaseQty = (id, currentQty) => {
		const newQty = Math.max(1, currentQty - 1);
		updateItemQuantity(id, newQty);
	};

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
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8 text-center md:text-left">
				Shopping Cart
			</h1>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Cart Items Table */}
				<div className="lg:col-span-3 overflow-x-auto shadow rounded-lg border border-gray-200">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-100">
								<TableHead className="text-center">Item</TableHead>
								<TableHead className="text-center">Price/Unit</TableHead>
								<TableHead className="text-center">Quantity</TableHead>
								<TableHead className="text-center">Price</TableHead>
								<TableHead className="text-center">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cart.map((item, idx) => (
								<TableRow key={idx} className="hover:bg-gray-50 transition">
									<TableCell className="flex items-center space-x-4 min-w-[150px] max-w-[200px]">
										<Link
											href={`/product/${item.id}`}
											className="flex items-center group w-full"
											tabIndex={-1}
										>
											{item.image && item.image.length > 0 && (
												<Image
													src={item.image[0]}
													alt={item.name}
													width={60}
													height={60}
													className="rounded-md object-cover group-hover:scale-105 transition-transform flex-shrink-0"
												/>
											)}
											<span className="ml-3 font-medium text-gray-800 truncate">
												{item.name}
											</span>
										</Link>
									</TableCell>

									<TableCell className="text-center text-gray-700 font-semibold">
										<p>฿{item.price}</p>
									</TableCell>

									<TableCell className="text-center space-x-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => decreaseQty(item.id, item.quantity)}
											aria-label={`Decrease quantity of ${item.name}`}
											className={`w-9 h-9 rounded-lg font-bold text-lg transition 
    													${
																item.quantity === 1
																	? "bg-gray-100 text-gray-400 cursor-not-allowed"
																	: "bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95 active:brightness-90 cursor-pointer"
															}`}
										>
											-
										</Button>

										<span className="inline-block w-8 text-center font-semibold text-lg">
											{item.quantity}
										</span>

										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												if (item.quantity < item.stock) {
													increaseQty(item.id, item.quantity, item.stock);
												}
											}}
											aria-label={`Increase quantity of ${item.name}`}
											className={`w-9 h-9 rounded-lg font-bold text-lg transition
    													${
																item.quantity >= item.stock
																	? "bg-gray-100 text-gray-400 cursor-not-allowed"
																	: "bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95 active:brightness-90 cursor-pointer"
															}`}
										>
											+
										</Button>
									</TableCell>

									<TableCell className="text-center font-bold text-gray-900">
										฿{(item.price * item.quantity).toFixed(2)}
									</TableCell>

									<TableCell className="text-center">
										<Button
											className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition active:scale-95 active:brightness-90 cursor-pointer"
											type="button"
											variant="destructive"
											size="sm"
											onClick={() => {
												removeFromCart(item.id);
												toast.success(`${item.name} removed from cart`);
											}}
											aria-label={`Remove ${item.name} from cart`}
										>
											Remove
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* Summary Card */}
				<Card className="shadow-lg rounded-lg border border-gray-200">
					<CardContent className="p-6 space-y-4">
						<h2 className="text-2xl font-semibold border-b pb-2">
							Order Summary
						</h2>
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
									toast.success("Cart cleared!");
								}}
								aria-label="Clear cart"
							>
								Clear Cart
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
