"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatId, formatDateTime } from "@/lib/formatters";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Loader, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PaypalLoadingState = () => {
	const [{ isPending, isRejected }] = usePayPalScriptReducer();
	if (isPending) {
		return (
			<div className="flex gap-2 justify-center text-center text-sm text-gray-600">
				<Loader className="w-5 h-5 animate-spin" /> Loading PayPal...
			</div>
		);
	} else if (isRejected) {
		return (
			<div className="flex gap-2 justify-center text-center text-red-600 font-semibold">
				Error while loading PayPal
			</div>
		);
	}
	return null;
};

export default function OrderDetailsTable({ order }) {
	const {
		id,
		shippingAddress,
		orderitems,
		itemsPrice,
		shippingPrice,
		totalPrice,
		paymentMethod,
		isDelivered,
		isPaid,
		paidAt,
		deliveredAt,
	} = order;
	const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isWaiting, startTransition] = useTransition();

	async function handleStripePayment(orderId) {
		try {
			// const stripe = await stripePromise;
			const res = await fetch("/api/stripe/create-checkout-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId }),
			});

			if (!res.ok) {
				const errorText = await res.text();
				toast.error("Failed to create Stripe session: " + errorText);
				return;
			}

			const data = await res.json();
			if (!data.success || !data.url) {
				toast.error(
					data.message || "Something went wrong creating Stripe session"
				);
				return;
			}

			// ✅ redirect ไปหน้า Stripe Checkout
			window.location.href = data.url;
		} catch (err) {
			console.error(err);
			alert("Stripe payment error: " + err.message);
		}
	}

	const handleCreatePaypalOrder = async () => {
		try {
			const res = await fetch("/api/paypal/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId: id }), // DB order id
			});

			if (!res.ok) {
				const errorText = await res.text();
				toast.error("Failed to create PayPal order: " + errorText);
				return;
			}

			const data = await res.json();

			if (!data.success) {
				toast.error(data.message);
				return;
			}

			return data.data.paypalOrderId; // return PayPal order ID
		} catch (error) {
			console.error("Error in handleCreatePaypalOrder:", error);
			toast.error("Something went wrong while creating the PayPal order.");
		}
	};

	const handleApprovePaypalOrder = async (data) => {
		try {
			const res = await fetch("/api/paypal/approve-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					orderId: id,
					paypalOrderId: data.orderID,
				}),
			});

			const result = await res.json();

			if (result.success) {
				toast.success(result.message);
				window.location.href = `/success?orderId=${id}`;
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("Something went wrong while approving the PayPal order.");
			console.error(error);
			throw error;
		}
	};

	const handleCashOnDelivery = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/orders/cash", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId: id }),
			});
			const result = await res.json();

			if (result.success) {
				window.location.href = `/confirm?orderId=${id}`;
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong with Cash on Delivery.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-extrabold py-4 border-b border-gray-200 mb-6">
				Order Details - <span className="text-blue-600">{formatId(id)}</span>
			</h1>

			<div className="grid md:grid-cols-3 md:gap-8">
				{/* Left side */}
				<div className="md:col-span-2 space-y-6">
					{/* Shipping Address Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								Shipping Address
							</CardTitle>
						</CardHeader>
						<CardContent>
							{shippingAddress ? (
								<>
									<p className="font-semibold text-lg">
										{shippingAddress.fullname}
									</p>
									<p className="whitespace-pre-line text-gray-700 leading-relaxed">
										{shippingAddress.address},
										<br />
										{shippingAddress.city}, {shippingAddress.province},{" "}
										{shippingAddress.postalCode}, {shippingAddress.country},
										<br />
										{shippingAddress.phone}
									</p>
								</>
							) : (
								<p>Loading address...</p>
							)}
							<div className="mt-4">
								{isDelivered ? (
									<span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
										Delivered at {formatDateTime(deliveredAt).dateTime}
									</span>
								) : (
									<span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
										Not Delivered
									</span>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Payment Method Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								Payment Method
							</CardTitle>
						</CardHeader>
						<CardContent>
							{paymentMethod ? (
								<p className="text-lg">{paymentMethod}</p>
							) : (
								<p>Loading payment method...</p>
							)}
							<div className="mt-4">
								{isPaid && paymentMethod !== "Cash" ? (
									<span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
										Paid at {formatDateTime(paidAt).dateTime}
									</span>
								) : (
									<span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
										Not Paid
									</span>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Order Items Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								Order Items
							</CardTitle>
						</CardHeader>
						<CardContent className="overflow-x-auto">
							<Table className="min-w-full">
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead className="text-center">Price/Unit</TableHead>
										<TableHead className="text-center">Quantity</TableHead>
										<TableHead className="text-center">Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map((item, index) => (
										<TableRow key={`${item.orderId}-${index}`}>
											<TableCell className="flex items-center space-x-3">
												<Link
													href={`/product/${item.id}`}
													className="flex items-center"
												>
													{item.image && item.image.length > 0 && (
														<Image
															src={item.image}
															alt={item.name}
															width={50}
															height={50}
															className="rounded-md"
														/>
													)}
													<span className="ml-3 font-medium">{item.name}</span>
												</Link>
											</TableCell>

											<TableCell className="text-center">
												<p>฿{item.price}</p>
											</TableCell>

											<TableCell className="text-center font-semibold">
												{item.qty}
											</TableCell>

											<TableCell className="text-center font-semibold">
												<p>฿{(item.price * item.qty).toFixed(2)}</p>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>

				{/* Right side */}
				<div className="space-y-6">
					<Card>
						<CardContent className="p-6 space-y-4">
							<div className="flex justify-between text-lg font-semibold">
								<div>Items:</div>
								<div>฿{itemsPrice}</div>
							</div>
							<div className="flex justify-between text-lg font-semibold">
								<div>Shipping:</div>
								<div>฿{shippingPrice}</div>
							</div>
							<div className="flex justify-between text-xl font-bold border-t pt-3">
								<div>Total:</div>
								<div>฿{totalPrice}</div>
							</div>

							{/* Paypal payment button */}
							<PayPalScriptProvider
								options={{
									clientId: PAYPAL_CLIENT_ID,
									currency: "THB",
									intent: "capture",
								}}
							>
								{!order.isPaid && order.paymentMethod === "Paypal" && (
									<>
										<PaypalLoadingState />
										<PayPalButtons
											createOrder={() => handleCreatePaypalOrder()}
											onApprove={async (data) =>
												await handleApprovePaypalOrder(data)
											}
											onError={(err) => {
												console.error(err);
												toast.error("PayPal error occurred");
											}}
										/>
									</>
								)}
							</PayPalScriptProvider>

							{/* Stripe payment button */}
							{!order.isPaid && order.paymentMethod === "Stripe" && (
								<button
									onClick={() => handleStripePayment(order.id)}
									className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 cursor-pointer"
								>
									Pay with Stripe
								</button>
							)}

							{/* Cash on Delivery */}
							{!isPaid && paymentMethod === "Cash" && (
								<div className="flex flex-col gap-3 justify-center">
									<div className="text-green-600 font-semibold text-center">
										Please click to confirm order
									</div>

									<Button
										className="cursor-pointer"
										onClick={handleCashOnDelivery}
										aria-label="Confirm Cash on Delivery"
										disabled={loading}
									>
										{loading && (
											<Loader className="w-5 h-5 animate-spin text-white" />
										)}
										Confirm
									</Button>
								</div>
							)}

							{order.isPaid && paymentMethod !== "Cash" && (
								<div className="flex flex-col gap-3 justify-center">
									<div className="text-green-600 font-semibold text-center">
										Payment Completed
									</div>
									<Button
										onClick={() => {
											setLoading(true);
											router.push("/orders");
										}}
										aria-label="Proceed to checkout"
										disabled={loading || isWaiting}
										className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white 
               										shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
              										active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer
              										${
																		loading || isWaiting
																			? "opacity-70 bg-gradient-to-r from-blue-500 to-indigo-500 cursor-not-allowed"
																			: ""
																	}`}
									>
										{(loading || isWaiting) && (
											<Loader className="w-5 h-5 animate-spin text-white" />
										)}
										Go to Orders page
										<ArrowRight className="w-5 h-5" />
									</Button>
								</div>
							)}
							{order.isPaid && paymentMethod === "Cash" && (
								<div className="flex flex-col gap-3 justify-center">
									<div className="text-green-600 font-semibold text-center">
										Order Confirmed
									</div>
									<Button
										onClick={() => {
											setLoading(true);
											router.push("/orders");
										}}
										aria-label="Proceed to checkout"
										disabled={loading || isWaiting}
										className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white 
               										shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
              										active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer
              										${
																		loading || isWaiting
																			? "opacity-70 bg-gradient-to-r from-blue-500 to-indigo-500 cursor-not-allowed"
																			: ""
																	}`}
									>
										{(loading || isWaiting) && (
											<Loader className="w-5 h-5 animate-spin text-white" />
										)}
										Go to Orders page
										<ArrowRight className="w-5 h-5" />
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
