import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateOrderToPaid } from "@/lib/paypal-service";

export async function POST(req) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "No sessionId" }
        
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, message: "Not paid yet" }, { status: 400 });
    }

    const orderId = session.metadata?.orderId;
    if (!orderId) throw new Error("No orderId in session metadata");

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        provider: "stripe",
        id: session.payment_intent || session.id,
        status: "COMPLETED",
        email_address: session.customer_details?.email || "",
        pricePaid: session.amount_total ? session.amount_total / 100 : 0,
      },
    });

    return NextResponse.json({
      success: true,
      redirectUrl: `/success?orderId=${orderId}`,
    });
  } catch (error) {
    console.error("verify-session error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}