"use client";

import { Suspense } from "react";
import SuccessDetails from "./SuccessDetails";

export default function SuccessPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-screen">
					Loading payment confirmation...
				</div>
			}
		>
			<SuccessDetails />
		</Suspense>
	);
}
