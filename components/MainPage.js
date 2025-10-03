import Image from "next/image";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import AddToCartButton from "./AddToCartButton";

async function getProducts() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
		if (!res.ok) {
			throw new Error(
				`Failed to fetch products: ${res.status} ${res.statusText}`
			);
		}

		return res.json();
	} catch (error) {
		return [];
	}
}

export default async function MainPage() {
	const products = await getProducts();
	return (
		<div className="mt-10 px-4 md:px-8 lg:px-12">
			<h1 className="text-3xl font-extrabold mb-8 text-center md:text-left">
				Featured Products
			</h1>
			<div
				className="
        grid 
        max-[727px]:grid-cols-1 
        max-[1000px]:grid-cols-2 
        max-[1450px]:grid-cols-3 
        grid-cols-4 
        gap-8 
        place-items-center
      "
			>
				{products.map((product, idx) => (
					<Card
						key={idx}
						className="hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-out rounded-xl cursor-pointer relative w-full max-w-xs"
					>
						<Link href={`/product/${product.id}`} className="block">
							<CardHeader className="p-0 overflow-hidden">
								<div className="relative aspect-square w-full">
									<Image
										src={product.images[0]}
										alt={product.name}
										fill
										className="object-cover transition-transform duration-300 hover:scale-105"
										priority={true}
									/>
								</div>
							</CardHeader>
							<CardContent className="p-5">
								<CardTitle className="text-xl font-semibold mb-2 line-clamp-1">
									{product.name}
								</CardTitle>
								<CardDescription className="text-sm text-gray-600 mb-4 line-clamp-1">
									{product.description}
								</CardDescription>
								<p className="text-lg font-bold text-amber-600">
									฿{product.price}
								</p>
							</CardContent>
						</Link>
						<AddToCartButton product={product} />
					</Card>
				))}
			</div>
		</div>
	);
}
