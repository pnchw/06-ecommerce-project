"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { Loader } from "lucide-react";
import LoadingPage from "@/components/Loading";

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
					<Card
						key={order.id}
						className="hover:shadow-lg transition-shadow duration-200"
					>
						<CardHeader>
							<CardTitle className="text-xl font-semibold flex justify-between items-center">
								<span>
									Order ID:{" "}
									<span className="text-blue-600">{formatId(order.id)}</span>
								</span>
								<Link
									href={`/order/${order.id}`}
									className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
								>
									View Details
								</Link>
							</CardTitle>
						</CardHeader>

						<CardContent>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<p>
										<span className="font-semibold">Created At:</span>{" "}
										{formatDateTime(order.createdAt).dateTime}
									</p>
									<p>
										<span className="font-semibold">Total Price:</span> ฿
										{order.totalPrice}
									</p>
									<p>
										<span className="font-semibold">Shipping Price:</span> ฿
										{order.shippingPrice}
									</p>
									<p>
										<span className="font-semibold">Payment Method:</span>{" "}
										{order.paymentMethod}
									</p>
								</div>

								<div className="space-y-2">
									<p>
										<span className="font-semibold">Payment Status:</span>{" "}
										{order.isPaid && order.paymentMethod !== "Cash" ? (
											<span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
												Paid at {formatDateTime(order.paidAt).dateTime}
											</span>
										) : (
											<span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
												Not Paid
											</span>
										)}
									</p>
									<p>
										<span className="font-semibold">Delivery Status:</span>{" "}
										{order.isDelivered ? (
											<span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
												Delivered at{" "}
												{formatDateTime(order.deliveredAt).dateTime}
											</span>
										) : (
											<span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
												Not Delivered
											</span>
										)}
									</p>
								</div>
							</div>

							{/* Order Items Table */}
							<div className="mt-4 overflow-x-auto">
								<Table className="min-w-full">
									<TableHeader>
										<TableRow>
											<TableHead>Item</TableHead>
											<TableHead className="text-center">Price/Unit</TableHead>
											<TableHead className="text-center">Quantity</TableHead>
											<TableHead className="text-center">Total</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{order.orderitems.map((item, idx) => (
											<TableRow key={`${order.id}-${idx}`}>
												<TableCell className="text-center">
													<Link
														href={`/product/${item.productId}`}
														className="flex items-center gap-2"
													>
														{item.image && (
															<Image
																src={item.image}
																alt={item.name}
																width={50}
																height={50}
																className="w-12 h-12 rounded-md object-cover"
															/>
														)}
														<span>{item.name}</span>
													</Link>
												</TableCell>
												<TableCell className="text-center">
													฿{item.price}
												</TableCell>
												<TableCell className="text-center">
													{item.qty}
												</TableCell>
												<TableCell className="text-center">
													฿{(item.price * item.qty).toFixed(2)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
