"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader } from "lucide-react";

export default function SuccessDetails() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const orderId = searchParams.get("orderId");
	const [countdown, setCountdown] = useState(3);
	const [status, setStatus] = useState("Processing your payment...");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!orderId) return;

		const verifyAndRedirect = async () => {
			if (sessionId) {
				try {
					const res = await fetch("/api/stripe/verify-session", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ sessionId }),
					});

					let data;
					try {
						data = await res.json();
					} catch (jsonErr) {
						console.warn("Response body is empty or not valid JSON.");
					}

					if (!res.ok || !data?.success) {
						setStatus(
							"Payment verification failed: " +
								(data?.message || res.statusText)
						);
						return;
					}

					setSuccess(true);
				} catch (err) {
					setStatus("Error: " + err.message);
					return;
				}
			} else {
				// PayPal already approved
				setSuccess(true);
			}

			// Countdown before redirect
			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						window.location.href = `/order/${orderId}`;
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		};

		verifyAndRedirect();
	}, [sessionId, orderId]);

	return (
		<div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
			<div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-md">
				{success ? (
					<CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
				) : (
					<Loader className="w-16 h-16 text-blue-500 animate-spin" />
				)}
				<h1 className="text-2xl font-bold text-center">{status}</h1>
				{success && (
					<p className="text-gray-700">Redirecting in {countdown} seconds...</p>
				)}
			</div>
		</div>
	);
}
