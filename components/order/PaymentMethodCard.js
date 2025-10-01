"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";

export default function PaymentMethodCard({ paymentMethod, isPaid, paidAt }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Payment Method</CardTitle>
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
	);
}
