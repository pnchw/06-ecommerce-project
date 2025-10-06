"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import GoToOrdersButton from "./GoToOrdersButton";

function PaypalLoadingState() {
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
}

export default function PaymentActions({
	itemsPrice,
	shippingPrice,
	totalPrice,
	isPaid,
	paymentMethod,
	orderId,
}) {
	const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
	const [loading, setLoading] = useState(false);
	const [isWaiting, startTransition] = useTransition();

	const handleStripePayment = async (orderId) => {
		setLoading(true);
		try {
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

			window.location.href = data.url;
		} catch (err) {
			console.error(err);
			toast.error("Stripe payment error: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCreatePaypalOrder = async () => {
		try {
			const res = await fetch("/api/paypal/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId }),
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

			return data.data.paypalOrderId;
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
					orderId,
					paypalOrderId: data.orderID,
				}),
			});

			const result = await res.json();

			if (result.success) {
				toast.success(result.message);
				window.location.href = `/success?orderId=${orderId}`;
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
				body: JSON.stringify({ orderId }),
			});
			const result = await res.json();

			if (result.success) {
				window.location.href = `/confirm?orderId=${orderId}`;
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
				<PayPalScriptProvider
					options={{
						clientId: PAYPAL_CLIENT_ID,
						currency: "THB",
						intent: "capture",
					}}
				>
					{!isPaid && paymentMethod === "Paypal" && (
						<>
							<PaypalLoadingState />
							<PayPalButtons
								createOrder={() => handleCreatePaypalOrder()}
								onApprove={async (data) => await handleApprovePaypalOrder(data)}
								onError={(err) => {
									console.error(err);
									toast.error("PayPal error occurred");
								}}
							/>
						</>
					)}
				</PayPalScriptProvider>

				{!isPaid && paymentMethod === "Stripe" && (
					<Button
						onClick={() => handleStripePayment(orderId)}
						className="w-full gap-2 px-6 py-3 font-semibold text-white 
               						shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105
              						active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer"
						disabled={loading}
					>
						{loading && <Loader className="w-5 h-5 animate-spin text-white" />}
						Pay with Stripe
					</Button>
				)}

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

				{isPaid && paymentMethod !== "Cash" && (
					<GoToOrdersButton
						loading={loading}
						isWaiting={isWaiting}
						text="Payment Completed"
					/>
				)}
				{isPaid && paymentMethod == "Cash" && (
					<GoToOrdersButton
						loading={loading}
						isWaiting={isWaiting}
						text="Order Confirmed"
					/>
				)}
			</CardContent>
		</Card>
	);
}
