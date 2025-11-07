import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/environments - környezetek listázása (játékosok számára)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const environments = await prisma.environment.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(environments);
  } catch (error) {
    console.error("Environments GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
