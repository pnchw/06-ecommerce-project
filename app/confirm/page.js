"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ConfirmPage() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");
	const [countdown, setCountdown] = useState(3);
	const router = useRouter();

	useEffect(() => {
		if (!orderId) return;

		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [orderId, router]);

	useEffect(() => {
		if (countdown === 0 && orderId) {
			router.push(`/order/${orderId}`);
		}
	}, [countdown, orderId, router]);

	return (
		<div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
			<div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-md">
				<CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
				<h1 className="text-2xl font-bold text-center">Order Confirmed!</h1>
				<p className="text-gray-700">Redirecting in {countdown} seconds...</p>
			</div>
		</div>
	);
}
