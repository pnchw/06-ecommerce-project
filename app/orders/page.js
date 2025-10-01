"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import LoadingPage from "@/components/Loading";
import OrderCard from "@/components/orders/OrderCard";

export default function Orders() {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchOrders() {
			try {
				const res = await fetch("api/orders");
				const data = await res.json();

				if (res.ok) {
					setOrders(data.orders || []);
				} else {
					console.error("Failed to fetch orders:", data.error);
				}
			} catch (error) {
				console.error("Error fetching orders:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchOrders();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader className="w-10 h-10 animate-spin text-blue-600" />
			</div>
		);
	}

	if (!orders.length) {
		return <LoadingPage page="You have no orders yet." />;
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-extrabold mb-6 text-gray-800">My Orders</h1>

			<div className="space-y-6">
				{orders.map((order) => (
					<OrderCard key={order.id} order={order} />
				))}
			</div>
		</div>
	);
}
