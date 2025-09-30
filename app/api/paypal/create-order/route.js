import { NextResponse } from "next/server";
import { createPayPalOrderService } from "@/lib/paypal-service";

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    const paypalOrderId = await createPayPalOrderService(orderId);
    return NextResponse.json({
      success: true,
      data: { paypalOrderId }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}