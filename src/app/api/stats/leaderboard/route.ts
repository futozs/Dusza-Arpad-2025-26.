import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLeaderboard } from "@/lib/stats";

// GET /api/stats/leaderboard - Toplista lekérése
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statParam = searchParams.get("stat") || "totalBattlesWon";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Egyszerűen átadjuk a paramétert - a típus ellenőrzés a getLeaderboard-ban történik
    const leaderboard = await getLeaderboard(statParam, limit);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
