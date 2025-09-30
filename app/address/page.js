"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
	const [shippingAddress, setShippingAddress] = useState({
		fullname: "",
		phone: "",
		address: "",
		city: "",
		province: "",
		postalCode: "",
		country: "",
	});
	const [loading, setLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	useEffect(() => {
		const checkAuthAndCart = async () => {
			const res = await fetch("/api/auth/session");
			const data = await res.json();
			const userId = data?.user?.id;

			if (!userId) {
				const callbackToCurrentPath = "/address";
				router.push(
					`/login?callbackUrl=${encodeURIComponent(callbackToCurrentPath)}`
				);
			}
		};

		checkAuthAndCart();
	}, [router]);

	const handleAddress = (e) => {
		setShippingAddress({
			...shippingAddress,
			[e.target.name]: e.target.value,
		});
		return shippingAddress;
	};

	async function handleSubmit(e) {
		e.preventDefault();

		const { fullname, phone, address, city, province, postalCode, country } =
			shippingAddress;

		if (
			!fullname ||
			!phone ||
			!address ||
			!city ||
			!province ||
			!postalCode ||
			!country
		) {
			toast.error("Please fill out all shipping fields.");
			return;
		}

		try {
			setLoading(true);
			startTransition(async () => {
				// Save address to user profile
				const addressRes = await fetch("/api/address", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(shippingAddress),
				});

				const result = await addressRes.json();

				if (!addressRes.ok) {
					toast.error(result?.error || "Failed to update address.");
					setLoading(false);
					return;
				}

				toast.success("Address updated successfully!");

				setTimeout(() => {
					router.push("/payment");
				}, 300);
			});
		} catch (error) {
			console.error("Error submitting address:", error);
			toast.error("Something went wrong.");
		} finally {
			setLoading(false);
		}
	}

	console.log(
		"This is shipping address details from page:",
		JSON.stringify(shippingAddress, null, 2)
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex justify-center items-start pt-20 px-4 pb-10">
				<div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
					<h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
						Shipping Address
					</h1>
					<p className="mb-8 text-center text-gray-600">
						Please provide your details for delivery
					</p>

					{/* Shipping Address Form */}
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Grid layout for form fields */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="fullname"
									className="block font-semibold mb-1 text-gray-700"
								>
									Full Name:
								</label>
								<input
									id="fullname"
									name="fullname"
									type="text"
									value={shippingAddress.fullname}
									onChange={handleAddress}
									placeholder="Your full name"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="phone"
									className="block font-semibold mb-1 text-gray-700"
								>
									Phone
								</label>
								<input
									id="phone"
									name="phone"
									type="tel"
									value={shippingAddress.phone}
									onChange={handleAddress}
									placeholder="Phone number"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="address"
									className="block font-semibold mb-1 text-gray-700"
								>
									Address
								</label>
								<input
									id="address"
									name="address"
									type="text"
									value={shippingAddress.address}
									onChange={handleAddress}
									placeholder="Street address"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="city"
									className="block font-semibold mb-1 text-gray-700"
								>
									City
								</label>
								<input
									id="city"
									name="city"
									type="text"
									value={shippingAddress.city}
									onChange={handleAddress}
									placeholder="City"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="province"
									className="block font-semibold mb-1 text-gray-700"
								>
									Province
								</label>
								<input
									id="province"
									name="province"
									type="text"
									value={shippingAddress.province}
									onChange={handleAddress}
									placeholder="Province"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="postalCode"
									className="block font-semibold mb-1 text-gray-700"
								>
									Postal Code
								</label>
								<input
									id="postalCode"
									name="postalCode"
									type="text"
									value={shippingAddress.postalCode}
									onChange={handleAddress}
									placeholder="Postal code"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="country"
									className="block font-semibold mb-1 text-gray-700"
								>
									Country
								</label>
								<input
									id="country"
									name="country"
									type="text"
									value={shippingAddress.country}
									onChange={handleAddress}
									placeholder="Country"
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

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
							Continue
							<ArrowRight className="w-5 h-5" />
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}