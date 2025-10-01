"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function GoToOrdersButton({ loading, isWaiting, text }) {
	const router = useRouter();
	const [iloading, setILoading] = useState(false);
	return (
		<div className="flex flex-col gap-3 justify-center">
			<div className="text-green-600 font-semibold text-center">{text}</div>
			<Button
				onClick={() => {
					setILoading(true);
					router.push("/orders");
				}}
				aria-label="Proceed to checkout"
				disabled={loading || isWaiting}
				className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white 
               				shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
              				active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer
              				${
												loading || isWaiting
													? "opacity-70 bg-gradient-to-r from-blue-500 to-indigo-500 cursor-not-allowed"
													: ""
											}`}
			>
				{(iloading || isWaiting) && (
					<Loader className="w-5 h-5 animate-spin text-white" />
				)}
				Go to Orders page
				<ArrowRight className="w-5 h-5" />
			</Button>
		</div>
	);
}
