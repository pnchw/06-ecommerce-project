import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("q");

	if (!query) {
		return NextResponse.json([]);
	}

	const products = await prisma.product.findMany({
		where: {
			name: {
				contains: query,
				mode: "insensitive",
			},
		},
		take: 8,
		select: {
			id: true,
			name: true,
			images: true,
		},
	});
	return NextResponse.json(products);
}
