"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch cart from DB when component mounts
	useEffect(() => {
		async function fetchCart() {
			try {
				const res = await fetch("/api/cart");
				const data = await res.json();
				if (res.ok) {
					setCart(data.cart);
				} else {
					console.log("Failed to fetch cart:", data.error);
				}
			} catch (error) {
				console.error("Error fetching cart:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCart();
	}, []);

	async function addToCart(product) {
		try {
			// 1. Update context state
			setCart((prevCart) => {
				const exists = prevCart.find((item) => item.id === product.id);
				if (exists) {
					return prevCart.map((item) =>
						item.id === product.id
							? { ...item, quantity: item.quantity + product.quantity }
							: item
					);
				}
				return [...prevCart, product];
			});
		} catch (err) {
			console.error("Error adding to cart:", err);
		}
	}

	async function updateItemQuantity(productId, quantity) {
		try {
			setCart((prevCart) =>
				prevCart.map((item) =>
					item.id === productId ? { ...item, quantity } : item
				)
			);

			await fetch("/api/cart", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity }),
			});
		} catch (err) {
			console.error("Error updating quantity:", err);
		}
	}

	async function removeFromCart(productId) {
		try {
			setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

			await fetch("/api/cart", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity: 0 }),
			});
		} catch (err) {
			console.error("Error removing from cart:", err);
		}
	}

	async function clearCart() {
		try {
			setCart([]);

			await fetch("/api/cart", {
				method: "DELETE",
			});
		} catch (err) {
			console.error("Error clearing cart:", err);
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
