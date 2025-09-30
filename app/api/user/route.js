import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();
	const userId = session?.user?.id;
    const user = await prisma.user.findFirst({
        where: { id: userId }
    });
    if (!user) throw new Error("User not found");
    return NextResponse.json({ user });
}