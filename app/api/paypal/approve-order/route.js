import { NextResponse } from "next/server";
import { approvePayPalOrderService } from "@/lib/paypal-service";

export async function POST(req) {
  try {
    const { orderId, paypalOrderId } = await req.json();
    const result = await approvePayPalOrderService(orderId, paypalOrderId);
    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}