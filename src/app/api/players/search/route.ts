import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Prisma client imported from singleton

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Nem vagy bejelentkezve" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Keresés felhasználónév alapján, csak publikus profilokat mutatunk
    // És a saját profilunkat is kiszűrjük
    const players = await prisma.user.findMany({
      where: {
        AND: [
          {
            username: {
              contains: query,
            },
          },
          {
            profileVisibility: true,
          },
          {
            id: {
              not: session.user.id,
            },
          },
          {
            role: "PLAYER",
          },
        ],
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        _count: {
          select: {
            games: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        username: "asc",
      },
    });

    // Összesített statisztikák lekérése minden játékoshoz
    const playersWithStats = await Promise.all(
      players.map(async (player) => {
        // Összes harc lekérése
        const battles = await prisma.battle.findMany({
          where: {
            game: {
              userId: player.id,
            },
          },
          select: {
            status: true,
          },
        });

        const totalBattles = battles.length;
        const wonBattles = battles.filter((b) => b.status === "WON").length;
        const lostBattles = battles.filter((b) => b.status === "LOST").length;
        const winRate = totalBattles > 0 ? (wonBattles / totalBattles) * 100 : 0;

        return {
          id: player.id,
          username: player.username,
          memberSince: player.createdAt,
          totalGames: player._count.games,
          stats: {
            totalBattles,
            wonBattles,
            lostBattles,
            winRate: Math.round(winRate * 10) / 10,
          },
        };
      })
    );

    return NextResponse.json({
      players: playersWithStats,
      total: playersWithStats.length,
    });
  } catch (error) {
    console.error("Error searching players:", error);
    return NextResponse.json(
      { error: "Hiba történt a játékosok keresése során" },
      { status: 500 }
    );
  }
}
