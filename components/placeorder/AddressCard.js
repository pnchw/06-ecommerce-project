"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddressCard({ userAddress }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">
					Shipping Address
				</CardTitle>
			</CardHeader>
			<CardContent>
				{userAddress ? (
					<>
						<p className="font-semibold text-lg">{userAddress.fullname}</p>
						<p className="whitespace-pre-line text-gray-700 leading-relaxed">
							{userAddress.address}, <br />
							{userAddress.city}, {userAddress.province},{" "}
							{userAddress.postalCode}, {userAddress.country}, <br />
							{userAddress.phone}
						</p>
					</>
				) : (
					<p>Loading address...</p>
				)}
				<div className="mt-4">
					<Link href={"/address"}>
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
