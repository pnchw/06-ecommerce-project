"use client";

import { Suspense } from "react";
import ConfirmDetails from "./ConfirmDetails";

export default function ConfirmPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-screen">
					Loading confirmation...
				</div>
			}
		>
			<ConfirmDetails />
		</Suspense>
	);
}
