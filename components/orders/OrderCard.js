import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatId, formatDateTime } from "@/lib/formatters";
import StatusBadge from "./StatusBadge";
import OrderItemsTable from "./OrderItemsTable";

export default function OrderCard({ order }) {
	return (
		<Card className="hover:shadow-lg transition-shadow duration-200">
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
							<StatusBadge
								isSuccess={order.isPaid && order.paymentMethod !== "Cash"}
								text={
									order.isPaid
										? `Paid at ${formatDateTime(order.paidAt).dateTime}`
										: "Not Paid"
								}
							/>
						</p>
						<p>
							<span className="font-semibold">Delivery Status:</span>{" "}
							<StatusBadge
								isSuccess={order.isDelivered}
								text={
									order.isDelivered
										? `Delivered at ${
												formatDateTime(order.deliveredAt).dateTime
										  }`
										: "Not Delivered"
								}
							/>
						</p>
					</div>
				</div>

				{/* Items Table */}
				<div className="mt-4 overflow-x-auto">
					<OrderItemsTable items={order.orderitems} orderId={order.id} />
				</div>
			</CardContent>
		</Card>
	);
}
