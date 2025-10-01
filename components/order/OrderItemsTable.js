"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function OrderItemsTable({ orderitems }) {
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
						{orderitems.map((item, idx) => (
							<TableRow key={`${item.orderId}-${idx}`}>
								<TableCell className="flex items-center space-x-3">
									<Link
										href={`/product/${item.id}`}
										className="flex items-center"
									>
										{item.image && item.image.length > 0 && (
											<Image
												src={item.image}
												alt={item.name}
												width={50}
												height={50}
												className="rounded-md"
											/>
										)}
										<span className="ml-3 font-medium">{item.name}</span>
									</Link>
								</TableCell>
								<TableCell className="text-center">฿{item.price}</TableCell>
								<TableCell className="text-center font-semibold">
									{item.qty}
								</TableCell>
								<TableCell className="text-center font-semibold">
									฿{(item.price * item.qty).toFixed(2)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
