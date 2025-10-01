"use client";

import { Button } from "@/components/ui/button";
import { Loader, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useState } from "react";

export default function PlaceOrderButton() {
	const { pending } = useFormStatus();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const res = await fetch("/api/order", { method: "POST" });
		const data = await res.json();
		if (data.redirectTo) {
			router.push(data.redirectTo);
		}
		setLoading(false);
	};
	return (
		<form className="w-full" onSubmit={handleSubmit}>
			<Button
				type="submit"
				disabled={pending || loading}
				className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white 
              				 shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
             				 active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer
              					${
													loading || pending
														? "opacity-70 bg-gradient-to-r from-blue-500 to-indigo-500 cursor-not-allowed"
														: ""
												}`}
			>
				{loading && <Loader className="w-5 h-5 animate-spin text-white" />}
				Proceed Checkout
				<ArrowRight className="w-5 h-5" />
			</Button>
		</form>
	);
}
