import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await auth();
  const userId = session?.user?.id;
  const currentUser = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentMethod } = await req.json();

  if (!paymentMethod) {
    return NextResponse.json(
      { error: "Payment method is required." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { paymentMethod: paymentMethod },
    });

    return NextResponse.json({
      message: "Payment method updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
