import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/game/[gameId]/battle/[battleId] - Konkrét harc részleteinek lekérése
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string; battleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const { gameId, battleId } = await params;

    // Ellenőrizzük, hogy a játék a felhasználóé-e
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Játék nem található" }, { status: 404 });
    }

    // Harc lekérése
    const battle = await prisma.battle.findUnique({
      where: { id: battleId },
      include: {
        dungeon: {
          include: {
            dungeonCards: {
              include: {
                worldCard: true,
                leaderCard: {
                  include: {
                    baseCard: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
        deck: {
          include: {
            deckCards: {
              include: {
                playerCard: {
                  include: {
                    baseCard: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
        clashes: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!battle || battle.gameId !== gameId) {
      return NextResponse.json({ error: "Harc nem található" }, { status: 404 });
    }

    return NextResponse.json(battle);
  } catch (error) {
    console.error("Battle detail GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
