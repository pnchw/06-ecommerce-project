import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
      const products = await prisma.product.findMany();
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
  }