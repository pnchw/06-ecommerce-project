"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
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
import { Loader } from "lucide-react";

export default function CartItemsTable() {
	const [loadingItems, setLoadingItems] = useState({});
	const { cart: contextCart, updateItemQuantity, removeFromCart } = useCart();
	const [cart, setCart] = useState([]);

	useEffect(() => {
		async function fetchStock() {
			try {
				const res = await fetch("/api/cart");
				const data = await res.json();
				if (res.ok && data.cart) {
					const mergedCart = contextCart.map((item) => {
						const backendItem = data.cart.find((b) => b.id === item.id);
						return backendItem ? { ...item, stock: backendItem.stock } : item;
					});
					setCart(mergedCart);
				}
			} catch (err) {
				console.error(err);
			}
		}
		fetchStock();
	}, [contextCart]);

	const setLoading = (id, type, state) => {
		setLoadingItems((prev) => ({
			...prev,
			[id]: { ...prev[id], [type]: state },
		}));
	};

	const increaseQty = async (id, currentQty, stock) => {
		if (currentQty >= stock) {
			toast.error("Not enough stock available");
			return;
		}

		setLoading(id, "increase", true);
		try {
			await updateItemQuantity(id, currentQty + 1);
		} catch (err) {
			console.error(err);
			toast.error("Failed to increase quantity");
		} finally {
			setLoading(id, "increase", false);
		}
	};

	const decreaseQty = async (id, currentQty) => {
		if (currentQty <= 1) return;

		setLoading(id, "decrease", true);
		try {
			await updateItemQuantity(id, currentQty - 1);
		} catch (err) {
			console.error(err);
			toast.error("Failed to decrease quantity");
		} finally {
			setLoading(id, "decrease", false);
		}
	};

	const handleRemove = async (itemId, itemName) => {
		setLoading(itemId, "remove", true);
		try {
			await removeFromCart(itemId);
			toast.success(`${itemName} removed from cart`);
		} catch (err) {
			console.error(err);
			toast.error(`Failed to remove ${itemName}`);
		} finally {
			setLoading(itemId, "remove", false);
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

							<TableCell className="text-center space-x-2 min-w-[160px]">
								<div className="flex justify-center items-center gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => decreaseQty(item.id, item.quantity)}
										disabled={
											item.quantity === 1 || loadingItems[item.id]?.decrease
										}
										className="w-9 h-9 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400
                 									active:scale-95 active:brightness-90 transition-all duration-150 cursor-pointer"
										aria-label={`Decrease quantity of ${item.name}`}
									>
										{loadingItems[item.id]?.decrease ? (
											<Loader className="w-4 h-4 animate-spin" />
										) : (
											"-"
										)}
									</Button>
									<span className="inline-block w-8 text-center font-semibold text-lg">
										{item.quantity}
									</span>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											increaseQty(item.id, item.quantity, item.stock)
										}
										disabled={
											item.stock === 0 ||
											item.quantity >= item.stock ||
											loadingItems[item.id]?.increase
										}
										className="w-9 h-9 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400
                 									active:scale-95 active:brightness-90 transition-all duration-150 cursor-pointer"
										aria-label={`Increase quantity of ${item.name}`}
									>
										{loadingItems[item.id]?.increase ? (
											<Loader className="w-4 h-4 animate-spin" />
										) : (
											"+"
										)}
									</Button>
								</div>
							</TableCell>

							<TableCell className="text-center font-bold text-gray-900 min-w-[100px] w-[100px]">
								<span className="inline-block w-full text-center">
									฿{(item.price * item.quantity).toFixed(2)}{" "}
								</span>
							</TableCell>

							<TableCell className="text-center">
								<Button
									className={`px-3 py-1.5 rounded-lg transition w-19 active:scale-95 active:brightness-90
       										 ${
															loadingItems
																? "bg-red-500 hover:bg-red-600 active:scale-95 active:brightness-90 cursor-pointer"
																: "bg-red-700 cursor-not-allowed scale-90"
														}`}
									type="button"
									variant="destructive"
									onClick={() => handleRemove(item.id, item.name)}
									disabled={loadingItems[item.id]?.remove}
									aria-label={`Remove ${item.name} from cart`}
								>
									{loadingItems[item.id]?.remove ? (
										<span className="flex items-center justify-center gap-2">
											<Loader size={18} className="animate-spin" />
										</span>
									) : (
										"Remove"
									)}
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
