"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function CartItemsTable() {
	const { cart, removeFromCart, updateItemQuantity } = useCart();

	const increaseQty = (id, currentQty) => {
		updateItemQuantity(id, currentQty + 1);
	};

	const decreaseQty = (id, currentQty) => {
		const newQty = Math.max(1, currentQty - 1);
		updateItemQuantity(id, newQty);
	};

	return (
		<div className="lg:col-span-3 overflow-x-auto shadow rounded-lg border border-gray-200">
			<Table>
				<TableHeader>
					<TableRow className="bg-gray-100">
						<TableHead className="text-center">Item</TableHead>
						<TableHead className="text-center">Price/Unit</TableHead>
						<TableHead className="text-center">Quantity</TableHead>
						<TableHead className="text-center">Price</TableHead>
						<TableHead className="text-center">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{cart.map((item) => (
						<TableRow key={item.id} className="hover:bg-gray-50 transition">
							<TableCell className="flex items-center space-x-4 min-w-[150px] max-w-[200px]">
								<Link
									href={`/product/${item.id}`}
									className="flex items-center group w-full"
									tabIndex={-1}
								>
									{item.image && item.image.length > 0 && (
										<Image
											src={item.image[0]}
											alt={item.name}
											width={60}
											height={60}
											className="rounded-md object-cover group-hover:scale-105 transition-transform flex-shrink-0"
										/>
									)}
									<span className="ml-3 font-medium text-gray-800 truncate">
										{item.name}
									</span>
								</Link>
							</TableCell>

							<TableCell className="text-center text-gray-700 font-semibold">
								฿{item.price}
							</TableCell>

							<TableCell className="text-center space-x-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => decreaseQty(item.id, item.quantity)}
									aria-label={`Decrease quantity of ${item.name}`}
									disabled={item.quantity === 1}
									className={`w-9 h-9 rounded-lg font-bold text-lg transition 
    						${
									item.quantity === 1
										? "bg-gray-100 text-gray-400"
										: "bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95 active:brightness-90 cursor-pointer"
								}`}
								>
									-
								</Button>
								<span className="inline-block w-8 text-center font-semibold text-lg">
									{item.quantity}
								</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => increaseQty(item.id, item.quantity)}
									aria-label={`Increase quantity of ${item.name}`}
									disabled={item.quantity >= item.stock}
									className={`w-9 h-9 rounded-lg font-bold text-lg transition
    						${
									item.quantity >= item.stock
										? "bg-gray-100 text-gray-400"
										: "bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95 active:brightness-90 cursor-pointer"
								}`}
								>
									+
								</Button>
							</TableCell>

							<TableCell className="text-center font-bold text-gray-900">
								฿{(item.price * item.quantity).toFixed(2)}
							</TableCell>

							<TableCell className="text-center">
								<Button
									className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition active:scale-95 active:brightness-90 cursor-pointer"
									type="button"
									variant="destructive"
									onClick={() => {
										removeFromCart(item.id);
										toast.success(`${item.name} removed from cart`);
									}}
									aria-label={`Remove ${item.name} from cart`}
								>
									Remove
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
