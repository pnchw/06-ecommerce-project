import "./globals.css";
import { Roboto } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
	weight: ["300", "700"],
	subsets: ["latin"],
});

export const metadata = {
	title: "E-Anime shop",
	description: "Anime character e-commerce shop",
	icons: {
		icon: "/assets/images/logo.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" type="image/png" href="/assets/images/logo.png" />
			</head>
			<body
				className={`${roboto.className} antialiased bg-[rgb(249, 243, 239)]`}
			>
				<SessionProvider>
					<CartProvider>
						<div className="flex flex-col min-h-screen">
							<Navbar />
							<main className="flex-grow">{children}</main>
							<Footer />
						</div>
						<Toaster />
					</CartProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
