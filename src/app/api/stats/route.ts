import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCalculatedStats } from "@/lib/stats";

// GET /api/stats - Saját statisztika lekérése
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const stats = await getCalculatedStats(session.user.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
