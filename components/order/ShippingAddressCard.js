"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";

export default function ShippingAddressCard({
	shippingAddress,
	isDelivered,
	deliveredAt,
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">
					Shipping Address
				</CardTitle>
			</CardHeader>
			<CardContent>
				{shippingAddress ? (
					<>
						<p className="font-semibold text-lg">{shippingAddress.fullname}</p>
						<p className="whitespace-pre-line text-gray-700 leading-relaxed">
							{shippingAddress.address},<br />
							{shippingAddress.city}, {shippingAddress.province},{" "}
							{shippingAddress.postalCode}, {shippingAddress.country},<br />
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
	);
}
