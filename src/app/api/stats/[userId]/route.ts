import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCalculatedStats } from "@/lib/stats";

// GET /api/stats/[userId] - Felhasználó statisztikája (ha publikus)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const { userId } = await params;

    // Ellenőrizzük, hogy publikus-e a profil vagy saját profil
    const targetUser = await (await import("@/lib/prisma")).prisma.user.findUnique({
      where: { id: userId },
      select: { profileVisibility: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    // Ha nem saját profil és nem publikus
    if (userId !== session.user.id && !targetUser.profileVisibility) {
      return NextResponse.json(
        { error: "A profil privát" },
        { status: 403 }
      );
    }

    const stats = await getCalculatedStats(userId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("User stats GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
