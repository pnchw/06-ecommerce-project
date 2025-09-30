import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const session = await auth();
		if (!session)
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);

		const { orderId } = await req.json();
		if (!orderId)
			return NextResponse.json(
				{ success: false, error: "Order ID is required" },
				{ status: 400 }
			);

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: { orderitems: true },
		});
		if (!order) {
			return NextResponse.json(
				{ success: false, error: "Order not found" },
				{ status: 404 }
			);
		}

		// Transaction ลด stock
		await prisma.$transaction(async (tx) => {
			for (const item of order.orderitems) {
				const product = await tx.product.findUnique({
					where: { id: item.productId },
				});
				if (!product || product.stock < item.qty) {
					throw new Error(`Not enough stock for product ${item.name}`);
				}

				await tx.product.update({
					where: { id: item.productId },
					data: { stock: { decrement: item.qty } },
				});
			}
			// Mark order as paid
			const paidOrder = await tx.order.update({
				where: { id: orderId },
				data: { isPaid: true, paidAt: new Date() },
			});

			return paidOrder;
		});

		return NextResponse.json({ success: true, order });
	} catch (err) {
		console.error("Cash on Delivery error:", err);
		return NextResponse.json(
			{ success: false, error: err.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
