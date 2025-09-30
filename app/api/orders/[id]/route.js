import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderitems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}