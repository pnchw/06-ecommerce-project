"use client";

import { formatId } from "@/lib/formatters";
import ShippingAddressCard from "@/components/order/ShippingAddressCard";
import PaymentMethodCard from "@/components/order/PaymentMethodCard";
import OrderItemsTable from "@/components/order/OrderItemsTable";
import PaymentActions from "@/components/order/PaymentActions";

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

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-extrabold py-4 border-b border-gray-200 mb-6">
				Order Details - <span className="text-blue-600">{formatId(id)}</span>
			</h1>

			<div className="grid md:grid-cols-3 gap-8">
				{/* Left side */}
				<div className="md:col-span-2 space-y-6">
					<ShippingAddressCard
						shippingAddress={shippingAddress}
						isDelivered={isDelivered}
						deliveredAt={deliveredAt}
					/>

					<PaymentMethodCard
						paymentMethod={paymentMethod}
						isPaid={isPaid}
						paidAt={paidAt}
					/>

					<OrderItemsTable orderitems={orderitems} />
				</div>

				{/* Right side */}
				<div className="space-y-6">
					<PaymentActions
						itemsPrice={itemsPrice}
						shippingPrice={shippingPrice}
						totalPrice={totalPrice}
						isPaid={isPaid}
						paymentMethod={paymentMethod}
						orderId={id}
					/>
				</div>
			</div>
		</div>
	);
}
