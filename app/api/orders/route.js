import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
	try {
		// Get user session
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized. Please log in." },
				{ status: 400 }
			);
		}
		// Fetch orders for the logged-in user
		const orders = await prisma.order.findMany({
			where: { userId: session?.user?.id },
			orderBy: { createdAt: "desc" },
			include: { orderitems: true },
		});
		return NextResponse.json({ orders });
	} catch (error) {
		console.error("[ORDERS GET]", error);
		return NextResponse.json(
			{ error: "Internal server errror" },
			{ status: 500 }
		);
	}
}
