import Link from "next/link";
import Image from "next/image";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function OrderItemsTable({ items, orderId }) {
	return (
		<Table className="min-w-full">
			<TableHeader>
				<TableRow>
					<TableHead>Item</TableHead>
					<TableHead className="text-center">Price/Unit</TableHead>
					<TableHead className="text-center">Quantity</TableHead>
					<TableHead className="text-center">Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item, idx) => (
					<TableRow key={`${orderId}-${idx}`}>
						<TableCell className="text-center">
							<Link
								href={`/product/${item.productId}`}
								className="flex items-center gap-2"
							>
								{item.image && (
									<Image
										src={item.image}
										alt={item.name}
										width={50}
										height={50}
										className="w-12 h-12 rounded-md object-cover"
									/>
								)}
								<span>{item.name}</span>
							</Link>
						</TableCell>
						<TableCell className="text-center">฿{item.price}</TableCell>
						<TableCell className="text-center">{item.qty}</TableCell>
						<TableCell className="text-center">
							฿{(item.price * item.qty).toFixed(2)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
