"use client";

import CartItemRow from "./CartItemRow";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function CartItemsTable({
	cart,
	updateItemQuantity,
	removeFromCart,
}) {
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
					{cart.map((item, idx) => (
						<CartItemRow
							key={idx}
							item={item}
							updateItemQuantity={updateItemQuantity}
							removeFromCart={removeFromCart}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
