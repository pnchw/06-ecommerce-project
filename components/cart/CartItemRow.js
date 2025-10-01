"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TableRow, TableCell } from "@/components/ui/table";

export default function CartItemRow({
	item,
	updateItemQuantity,
	removeFromCart,
}) {
	const increaseQty = () => {
		if (item.quantity < item.stock) {
			updateItemQuantity(item.id, item.quantity + 1);
		}
	};

	const decreaseQty = () => {
		if (item.quantity > 1) {
			updateItemQuantity(item.id, item.quantity - 1);
		}
	};

	return (
		<TableRow className="hover:bg-gray-50 transition">
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
					onClick={decreaseQty}
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
					onClick={increaseQty}
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
	);
}
