"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddressForm from "@/components/address/AddressForm";

export default function AddressPage() {
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

	const handleSubmit = async (addressData) => {
		const { fullname, phone, address, city, province, postalCode, country } =
			addressData;

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
				const addressRes = await fetch("/api/address", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(addressData),
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
	};
	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<AddressForm
				shippingAddress={shippingAddress}
				setShippingAddress={setShippingAddress}
				loading={loading}
				isPending={isPending}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
