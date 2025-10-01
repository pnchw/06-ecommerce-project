"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCard({ userPayment }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Payment Method</CardTitle>
			</CardHeader>
			<CardContent>
				{userPayment ? (
					<p className="text-lg">{userPayment}</p>
				) : (
					<p>Loading payment method...</p>
				)}
				<div className="mt-4">
					<Link href={"/payment"}>
						<Button
							variant="outline"
							className="w-full sm:w-auto cursor-pointer"
						>
							Edit
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
