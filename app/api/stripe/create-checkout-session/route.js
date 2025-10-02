import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const { orderId } = await req.json();
		if (!orderId) {
			return NextResponse.json(
				{ success: false, message: "Missing orderId" },
				{ status: 400 }
			);
		}

		const order = await prisma.order.findFirst({
			where: { id: orderId },
			include: { orderitems: true },
		});
		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		// Use THB
		const currency = "thb";
		const baseUrl = process.env.BASE_URL;

		const line_items = order.orderitems.map((item) => ({
			price_data: {
				currency,
				product_data: {
					name: item.name,
				},
				unit_amount: Math.round(Number(item.price) * 100),
			},
			quantity: item.qty,
		}));

		if (Number(order.shippingPrice) > 0) {
			line_items.push({
				price_data: {
					currency,
					product_data: { name: "Shipping" },
					unit_amount: Math.round(Number(order.shippingPrice) * 100),
				},
				quantity: 1,
			});
		}

		const session = await stripe.checkout.sessions.create(
			{
				mode: "payment",
				payment_method_types: ["card"],
				line_items,
				success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
				cancel_url: `${baseUrl}/order-cancel`,
				metadata: { orderId },
			},
			{
				idempotencyKey: `order_${orderId}`,
			}
		);

		// Save the session id
		await prisma.order.update({
			where: { id: orderId },
			data: {
				paymentResult: {
					provider: "stripe",
					sessionId: session.id,
					status: "CREATED",
				},
			},
		});

		return NextResponse.json({
			success: true,
			url: session.url,
			sessionId: session.id,
		});
	} catch (error) {
		console.error("create-checkout-session error:", error);
		return NextResponse.json(
			{ success: false, message: error.message || "Stripe error" },
			{ status: 500 }
		);
	}
}
