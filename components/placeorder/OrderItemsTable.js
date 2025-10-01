"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function OrderItemsTable({ cart }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Order Items</CardTitle>
			</CardHeader>
			<CardContent className="overflow-x-auto">
				<Table className="min-w-full">
					<TableHeader>
						<TableRow>
							<TableHead>Item</TableHead>
							<TableHead className="text-center">Price/Unit</TableHead>
							<TableHead className="text-center">Quantity</TableHead>
							<TableHead className="text-center">Price</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{cart.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="flex items-center space-x-3">
									<Link
										href={`/product/${item.id}`}
										className="flex items-center"
									>
										{item.image && item.image.length > 0 && (
											<Image
												src={item.image[0]}
												alt={item.name}
												width={50}
												height={50}
												className="rounded-md"
											/>
										)}
										<span className="px-3 font-medium">{item.name}</span>
									</Link>
								</TableCell>
								<TableCell className="text-center">
									฿{Number(item.price)}
								</TableCell>

								<TableCell className="text-center font-semibold">
									{item.quantity}
								</TableCell>

								<TableCell className="text-center font-semibold">
									฿{(Number(item.price) * item.quantity).toFixed(2)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="mt-4">
					<Link href={"/cart"}>
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
