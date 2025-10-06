"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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
import { Loader } from "lucide-react";

export default function CartItemsTable({
	cart,
	updateItemQuantity,
	removeFromCart,
}) {
	const [loadingItems, setLoadingItems] = useState({});
	const [removingItems, setRemovingItems] = useState({});
	const [tempQty, setTempQty] = useState({});
	const debouncedRefs = useRef({});

	const setLoading = (id, state) => {
		setLoadingItems((prev) => ({ ...prev, [id]: state }));
	};

	// create/get per-item debounced updater
	const getDebouncedUpdater = (id, previousQty) => {
		if (!debouncedRefs.current[id]) {
			debouncedRefs.current[id] = {
				timer: null,
				fn: (qty) => {
					if (debouncedRefs.current[id].timer) {
						clearTimeout(debouncedRefs.current[id].timer);
					}
					debouncedRefs.current[id].timer = setTimeout(async () => {
						setLoading(id, true);
						try {
							await updateItemQuantity(id, qty);
							setTempQty((prev) => {
								const copy = { ...prev };
								delete copy[id];
								return copy;
							});
						} catch (err) {
							console.error("Failed to update quantity", err);
							toast.error("Failed to update quantity");
							setTempQty((prev) => ({ ...prev, [id]: previousQty }));
						} finally {
							setLoading(id, false);
							debouncedRefs.current[id].timer = null;
						}
					}, 500);
				},
			};
		}
		return debouncedRefs.current[id].fn;
	};

	useEffect(() => {
		return () => {
			Object.values(debouncedRefs.current).forEach((entry) => {
				if (entry?.timer) clearTimeout(entry.timer);
			});
		};
	}, []);

	const changeQty = (id, currentQty, delta, stock) => {
		const newQty = currentQty + delta;
		if (newQty < 1) return;
		if (newQty > stock) {
			return;
		}
		setTempQty((prev) => ({ ...prev, [id]: newQty }));
		const debouncedUpdate = getDebouncedUpdater(id, currentQty);
		debouncedUpdate(newQty);
	};

	const handleRemove = async (itemId, itemName) => {
		if (removingItems[itemId]) return;
		setRemovingItems((prev) => ({ ...prev, [itemId]: true }));

		try {
			await removeFromCart(itemId);
			toast.success(`${itemName} removed from cart`);
			setTempQty((prev) => {
				const copy = { ...prev };
				delete copy[itemId];
				return copy;
			});
		} catch (err) {
			console.error(err);
			toast.error(`Failed to remove ${itemName}`);
		} finally {
			setRemovingItems((prev) => ({ ...prev, [itemId]: false }));
		}
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
					{cart.map((item) => {
						const currentQty = tempQty[item.id] ?? item.quantity;
						const isQtyLoading = !!loadingItems[item.id];
						const isRemoving = !!removingItems[item.id];

						return (
							<TableRow key={item.id} className="hover:bg-gray-50 transition">
								<TableCell className="flex items-center space-x-4 min-w-[150px] max-w-[230px]">
									<Link
										href={`/product/${item.id}`}
										className="flex items-center group w-full"
										tabIndex={-1}
									>
										{item.image?.[0] && (
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

								<TableCell className="text-center space-x-2 min-w-[160px]">
									<div className="flex justify-center items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												changeQty(item.id, currentQty, -1, item.stock)
											}
											disabled={currentQty === 1 || isQtyLoading}
											className="w-9 h-9 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 active:scale-95 transition-all duration-150 cursor-pointer"
										>
											-
										</Button>

										<span className="inline-block w-8 text-center font-semibold text-lg">
											{currentQty}
										</span>

										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												changeQty(item.id, currentQty, +1, item.stock)
											}
											disabled={currentQty >= item.stock || isQtyLoading}
											className="w-9 h-9 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 active:scale-95 transition-all duration-150 cursor-pointer"
										>
											+
										</Button>
									</div>
								</TableCell>

								<TableCell className="text-center font-bold text-gray-900 min-w-[100px]">
									฿{(item.price * currentQty).toFixed(2)}
								</TableCell>

								<TableCell className="text-center">
									<Button
										className={`px-3 py-1.5 w-19 rounded-lg transition active:scale-95 ${
											isRemoving
												? "bg-red-700 cursor-not-allowed"
												: "bg-red-500 hover:bg-red-600 cursor-pointer"
										}`}
										onClick={() => handleRemove(item.id, item.name)}
										disabled={isRemoving}
									>
										{isRemoving ? (
											<Loader className="w-5 h-5 animate-spin" />
										) : (
											"Remove"
										)}
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
