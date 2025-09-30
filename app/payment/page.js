"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PaymentMethod({ searchParams }) {
	const paymentMethods = process.env.PAYMENT_METHODS
		? process.env.PAYMENT_METHODS.split(", ")
		: ["Paypal", "Stripe", "Cash"];
	const defaultPaymentMethod = process.env.DEFAULT_PAYMENT_METHOD || "Paypal";

	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState(defaultPaymentMethod);

	const [loading, setLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			// check if user logged in?
			const res = await fetch("/api/auth/session");
			const data = await res.json();
			const userId = data?.user?.id;

			// if no, redirect to login with callback
			if (!userId) {
				const callbackToCurrentPath = "/payment";
				router.push(
					`/login?callbackUrl=${encodeURIComponent(callbackToCurrentPath)}`
				);
			}
		};
		checkAuth();
	}, [router]);

	async function handleSubmit(e) {
		e.preventDefault();

		if (!selectedPaymentMethod) {
			toast.error("Please select a payment method.");
			return;
		}

		try {
			setLoading(true);
			startTransition(async () => {
				const res = await fetch("/api/payment", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ paymentMethod: selectedPaymentMethod }),
				});

				let result;
				try {
					result = await res.json();
				} catch (jsonErr) {
					console.warn("Response body is empty or not valid JSON.");
				}

				if (!res.ok) {
					toast.error(result?.error || "Failed to save payment method.");
					setLoading(false);
					return;
				}

				toast.success("Payment method saved!");
				router.push("/place-order");
			});
		} catch (error) {
			console.error("Submission error:", error);
			toast.error("Something went wrong.");
		} finally {
			setLoading(false);
		}
	}

	console.log(
		"This is method details from page:",
		JSON.stringify(selectedPaymentMethod)
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex justify-center items-start pt-20 px-4 pb-10">
				<div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
					<h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
						Payment Method
					</h1>
					<p className="mb-8 text-center text-gray-600">
						Please select a payment method to continue
					</p>
					<form onSubmit={handleSubmit}>
						<RadioGroup
							defaultValue={defaultPaymentMethod}
							onValueChange={setSelectedPaymentMethod}
							className="flex flex-col space-y-3 mb-8"
						>
							{paymentMethods.map((method) => (
								<label
									key={method}
									htmlFor={`pm-${method}`}
									className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-500 transition-all bg-gray-50 hover:bg-gray-100"
								>
									<RadioGroupItem
										value={method}
										id={`pm-${method}`}
										className="ring-offset-white focus:ring-2 focus:ring-blue-600"
									/>

									<span className="text-lg font-medium text-gray-800">
										{method}
									</span>
								</label>
							))}
						</RadioGroup>

						<Button
							type="submit"
							disabled={loading || isPending}
							className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white 
               shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
              active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer
              ${
								loading || isPending
									? "opacity-70 bg-gradient-to-r from-blue-500 to-indigo-500 cursor-not-allowed"
									: ""
							}`}
						>
							{(loading || isPending) && (
								<Loader className="w-5 h-5 animate-spin text-white" />
							)}
							Proceed Checkout
							<ArrowRight className="w-5 h-5" />
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}