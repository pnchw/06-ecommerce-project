import { prisma } from "@/lib/prisma";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";

export async function createPayPalOrderService(orderId) {
  const order = await prisma.order.findFirst({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  // ส่ง THB ให้ PayPal
  const paypalOrder = await paypal.createOrder(Number(order.totalPrice), "THB");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentResult: {
        id: paypalOrder.id,
        email_address: "",
        status: "CREATED",
        pricePaid: 0,
      },
    },
  });

  return paypalOrder.id;
}

export async function approvePayPalOrderService(orderId, paypalOrderId) {
  const order = await prisma.order.findFirst({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const captureData = await paypal.createPayment(paypalOrderId);

  if (!captureData || captureData.status !== "COMPLETED") {
    throw new Error(
      `PayPal payment not completed: ${captureData?.status || "Unknown"}`
    );
  }

  const capture = captureData?.purchase_units?.[0]?.payments?.captures?.[0];
  await updateOrderToPaid({
    orderId,
    paymentResult: {
      provider: "paypal",
      id: capture?.id || captureData.id,
      status: captureData.status,
      email_address: captureData?.payer?.email_address || "",
      pricePaid: capture?.amount?.value ? Number(capture.amount.value) : 0,
    },
  });

  revalidatePath(`/order/${orderId}`);
  return { message: "Your order has been paid" };
}

// Shared helper to update DB after payment
export async function updateOrderToPaid({ orderId, paymentResult }) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderitems: true },
  });
  if (!order) throw new Error("Order not found");

  // Idempotent: ถ้า isPaid เป็น true แล้ว return เลย
  if (order.isPaid) {
    console.log("Order already paid, stock not changed");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // decrement product stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }
    // update order paid status
    await tx.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
  });
  return order;
}