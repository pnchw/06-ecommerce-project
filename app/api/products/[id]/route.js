import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//get a single product by id
export async function GET(req, { params }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: id },
    });

    if(!product) {
        return NextResponse.json({ error: "Product not found"}, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
}