"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Search, X } from "lucide-react";
import Container from "../Container";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartCount } from "@/app/context/CartContext";

export default function Navbar() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const searchRef = useRef(null);
	const dropdownRef = useRef(null);
	const cartCount = useCartCount();

	useEffect(() => {
		if (query.length < 1) {
			setResults([]);
			setShowDropdown(false);
			return;
		}

		const fetchProducts = async () => {
			try {
				const res = await fetch(`/api/products/search?q=${query}`);
				const data = await res.json();
				setResults(data);
				setShowDropdown(true);
			} catch (err) {
				console.error("Search error:", err);
			}
		};

		const debounce = setTimeout(fetchProducts, 300); // debounce typing
		return () => clearTimeout(debounce);
	}, [query]);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 640;
			setIsMobile(mobile);

			if (!mobile) {
				setIsSearchOpen(false); // desktop: always full search, no toggle
			} else {
				// mobile case
				if (query.trim().length > 0 && results.length > 0) {
					setIsSearchOpen(true); // force open if results exist
				}
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [query, results]);

	const handleSearch = (e) => {
		e.preventDefault();
		if (!query.trim()) return;
		router.push(`/search?query=${encodeURIComponent(query)}`);
		setShowDropdown(false);
		if (isMobile) setIsSearchOpen(false);
	};

	useEffect(() => {
		function handleClickOutside(e) {
			if (
				searchRef.current &&
				!searchRef.current.contains(e.target) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target)
			) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="fixed top-0 w-full bg-[#0a2540] shadow-md z-50">
			<Container>
				<div className="flex items-center justify-between h-16 py-3 relative">
					{/* Logo (hidden on mobile when search is open) */}
					{(!isMobile || !isSearchOpen) && (
						<Link
							href="/"
							aria-label="Go to homepage"
							className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer min-w-[250px] max-w-[350px]"
						>
							<Image
								className="rounded-full"
								src={"/assets/images/logo.png"}
								width={40}
								height={40}
								alt="Logo"
								priority
							/>
							<span className="text-white font-bold text-lg tracking-wide select-none">
								E-Anime Shop
							</span>
						</Link>
					)}

					{/* Search Section */}
					<div className="flex-1 flex justify-center relative" ref={searchRef}>
						{/* Desktop / Tablet (always visible) */}
						{!isMobile && (
							<div className="w-full max-w-md ml-auto px-3">
								<form
									onSubmit={handleSearch}
									className="flex items-center bg-gray-100 rounded-full shadow px-4 py-2 focus-within:shadow-lg"
								>
									<input
										type="text"
										placeholder="Search..."
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										className="flex-1 bg-transparent outline-none px-2 text-gray-700 placeholder-gray-400"
									/>
									<button type="submit">
										<Search className="w-5 h-5 text-gray-500" />
									</button>
								</form>
							</div>
						)}

						{/* Mobile (< sm) */}
						{isMobile && (
							<div className="ml-auto flex items-center">
								{isSearchOpen ? (
									<form
										onSubmit={handleSearch}
										className="absolute left-0 w-full h-16 flex items-center bg-[#0a2540] px-4 z-50"
									>
										<div className="relative flex-1">
											<input
												type="text"
												placeholder="Search..."
												value={query}
												onChange={(e) => setQuery(e.target.value)}
												className="w-full bg-white rounded-full px-4 py-2 outline-none pr-10"
												autoFocus
											/>
											<button
												type="button"
												onClick={() => {
													setIsSearchOpen(false);
													setShowDropdown(false);
												}}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-800"
											>
												<X className="w-5 h-5" />
											</button>
										</div>
									</form>
								) : (
									<button
										key="mobile-icon"
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.8, opacity: 0 }}
										transition={{ duration: 0.2 }}
										type="button"
										onClick={() => setIsSearchOpen(true)}
										className="text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-600 transition mr-2 cursor-pointer"
									>
										<Search className="w-6 h-6" />
									</button>
								)}
							</div>
						)}

						{/* Dropdown results (always below search bar if open) */}
						{showDropdown && results.length > 0 && (
							<div
								ref={dropdownRef}
								className="absolute top-5 sm:top-full left-0 sm:left-auto sm:right-0 sm:w-[calc(100%-1.5rem)] w-full bg-white shadow-lg border rounded-lg max-h-64 overflow-y-auto z-50"
							>
								{results.map((product) => (
									<Link
										key={product.id}
										href={`/product/${product.id}`}
										className="flex items-center gap-2 p-2 hover:bg-gray-100 transition"
										onClick={() => setShowDropdown(false)}
									>
										{product.images?.[0] && (
											<Image
												src={product.images[0]}
												alt={product.name}
												width={40}
												height={40}
												className="rounded"
											/>
										)}
										<span className="text-gray-800 text-sm">
											{product.name}
										</span>
									</Link>
								))}
							</div>
						)}
					</div>

					{/* Right Section */}
					<div className="flex items-center gap-3">
						{/* Cart Button */}
						<Link href="/cart" className="relative">
							<button className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
								<ShoppingCart className="w-5 h-5" />
								{cartCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
										{cartCount}
									</span>
								)}
							</button>
						</Link>

						{/* Auth Buttons */}
						{status === "loading" ? (
							<p className="text-white select-none">Loading...</p>
						) : session ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition-shadow shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
										{session.user?.name?.[0]?.toUpperCase() ||
											session.user?.email?.[0]?.toUpperCase() ||
											"?"}
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44">
									<DropdownMenuItem asChild>
										<Link
											href="/orders"
											className="w-full cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition"
										>
											My Orders
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => signOut({ callbackUrl: "/" })}
										className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition"
									>
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<>
								<div className="flex flex-col md:flex-row md:gap-2 items-center w-full max-w-[300px]">
									<Link href="/register">
										<button className="w-full bg-gradient-to-tr from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-bold px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md transition-all cursor-pointer text-sm md:text-base">
											Register
										</button>
									</Link>
									<Link href="/login">
										<button className="w-full bg-white hover:bg-gray-100 text-blue-600 font-bold px-3 py-1 md:px-4 md:py-2 rounded-full border border-gray-200 shadow-sm transition-all cursor-pointer text-sm md:text-base">
											Login
										</button>
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
}