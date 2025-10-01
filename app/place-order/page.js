"use client";

import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddressCard from "@/components/placeorder/AddressCard";
import PaymentCard from "@/components/placeorder/PaymentCard";
import OrderItemsTable from "@/components/placeorder/OrderItemsTable";
import OrderSummary from "@/components/placeorder/OrderSummary";

export default function PlaceOrder() {
	const { cart } = useCart();
	const router = useRouter();

	const [userAddress, setUserAddress] = useState(null);
	const [userPayment, setUserPayment] = useState(null);

	const itemsPrice = cart.reduce((total, item) => {
		return total + Number(item.price) * item.quantity;
	}, 0);

	const shippingPrice = itemsPrice > 150 ? 0 : 35;

	const totalPrice = itemsPrice + shippingPrice;

	useEffect(() => {
		const checkAuthCartAddress = async () => {
			try {
				if (!cart || cart.length === 0) return router.push("/cart");

				const resAuth = await fetch("/api/auth/session");
				const dataAuth = await resAuth.json();
				const userId = dataAuth?.user?.id;

				if (!userId) {
					return router.push(
						`/login?callbackUrl=${encodeURIComponent("/address")}`
					);
				}

				const resUser = await fetch("/api/user");
				const dataUser = await resUser.json();

				const address = dataUser?.user?.address;
				const payment = dataUser?.user?.paymentMethod;

				if (!address) return router.push("/address");
				if (!payment) return router.push("/payment");

				setUserAddress(address);
				setUserPayment(payment);
			} catch (error) {
				console.error("Error loading user/cart info:", err);
				router.push("/login");
			}
		};

		checkAuthCartAddress();
	}, [cart, router]);

	return (
		<div className="mt-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
			<h1 className="text-3xl font-extrabold mb-6 border-b border-gray-300 pb-3">
				Place Order
			</h1>
			<div className="grid md:grid-cols-3 md:gap-8">
				{/* Left side */}
				<div className="md:col-span-2 space-y-8 overflow-x-auto">
					<AddressCard userAddress={userAddress} />
					<PaymentCard userPayment={userPayment} />
					<OrderItemsTable cart={cart} />
				</div>

				{/* Right side */}
				<div className="space-y-6">
					<OrderSummary
						itemsPrice={itemsPrice}
						shippingPrice={shippingPrice}
						totalPrice={totalPrice}
					/>
				</div>
			</div>
		</div>
	);
}
