"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	async function fetchCartFromServer() {
		try {
			setIsLoading(true);
			const res = await fetch("/api/cart");
			const data = await res.json();
			if (res.ok && data.cart) {
				setCart(
					data.cart.map((item) => ({
						...item,
						stock: item.stock ?? 0,
						id: item.id ?? item.productId,
					}))
				);
			} else {
				setCart([]);
			}
		} catch (err) {
			console.error("Error fetching cart:", err);
			setCart([]);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchCartFromServer();
	}, []);

	async function addToCart(product) {
		try {
			setCart((prevCart) => {
				const exists = prevCart.find((item) => item.id === product.id);
				if (exists) {
					return prevCart.map((item) =>
						item.id === product.id
							? {
									...item,
									quantity: item.quantity + (product.quantity ?? 1),
									stock: product.stock ?? item.stock,
							  }
							: item
					);
				}
				return [
					...prevCart,
					{
						id: product.id,
						name: product.name,
						image: product.image,
						price: product.price,
						quantity: product.quantity ?? 1,
						stock: product.stock ?? 0,
					},
				];
			});

			const res = await fetch("/api/cart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					productId: product.id,
					quantity: product.quantity ?? 1,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				if (data.error?.toLowerCase().includes("stock")) {
					toast.error("Not enough stock available");
				} else {
					toast.error(data.error || "Failed to add to cart");
				}

				await fetchCartFromServer();
				return false;
			}

			await fetchCartFromServer();
			return true;
		} catch (err) {
			console.error("Error adding to cart:", err);
			toast.error("Something went wrong");
			return false;
		}
	}

	async function updateItemQuantity(productId, quantity) {
		try {
			setCart((prevCart) =>
				prevCart.map((item) =>
					item.id === productId ? { ...item, quantity } : item
				)
			);

			const res = await fetch("/api/cart", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to update quantity");
			}

			return data;
		} catch (err) {
			console.error("Error updating quantity:", err);
			toast.error(err.message);
			await fetchCartFromServer();
		}
	}

	async function removeFromCart(productId) {
		try {
			const res = await fetch("/api/cart", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity: 0 }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to remove item");
			}

			setCart((prev) => prev.filter((item) => item.id !== productId));
			return data;
		} catch (err) {
			console.error(err);
			toast.error(err.message);
			await fetchCartFromServer();
		}
	}

	async function clearCart() {
		try {
			const res = await fetch("/api/cart", {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to clear cart");
			}
			setCart([]);
			return data;
		} catch (err) {
			console.error("Error clearing cart:", err);
			throw err;
		}
	}

	return (
		<CartContext.Provider
			value={{
				cart,
				setCart,
				isLoading,
				addToCart,
				removeFromCart,
				clearCart,
				updateItemQuantity,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	return useContext(CartContext);
}

export function useCartCount() {
	const { cart } = useCart();
	return cart.reduce((sum, item) => sum + item.quantity, 0);
}
