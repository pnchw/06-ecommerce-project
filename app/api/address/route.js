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

	const body = await req.json();
	console.log("Received address:", body);

	try {
		await prisma.user.update({
			where: { id: userId },
			data: { address: body },
		});

		return NextResponse.json({ message: "Address updated successfully" });
	} catch (error) {
		console.error("Error updating address:", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}

