import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST /api/game/[gameId]/battle/[battleId]/reward - Jutalom alkalmazása
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string; battleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const { gameId, battleId } = await params;
    const body = await request.json();
    const { playerCardId } = body; // Melyik kártyát fejlesztjük

    if (!playerCardId) {
      return NextResponse.json({ error: "Hiányzó playerCardId" }, { status: 400 });
    }

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
        dungeon: true,
      },
    });

    if (!battle || battle.gameId !== gameId) {
      return NextResponse.json({ error: "Harc nem található" }, { status: 404 });
    }

    if (battle.status !== "WON") {
      return NextResponse.json(
        { error: "Csak megnyert harc után lehet jutalmat kapni" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy a kártya a játékos gyűjteményéből van-e
    const playerCard = await prisma.playerCard.findUnique({
      where: { id: playerCardId },
      include: { baseCard: true },
    });

    if (!playerCard || playerCard.gameId !== gameId) {
      return NextResponse.json(
        { error: "Kártya nem található a gyűjteményben" },
        { status: 404 }
      );
    }

    // Jutalom típusának meghatározása a kazamata típusa alapján
    let damageBoost = 0;
    let healthBoost = 0;

    switch (battle.dungeon.type) {
      case "SIMPLE_ENCOUNTER":
        damageBoost = 1;
        break;
      case "SMALL_DUNGEON":
        healthBoost = 2;
        break;
      case "LARGE_DUNGEON":
        damageBoost = 3;
        break;
    }

    // Kártya fejlesztése
    const updatedCard = await prisma.playerCard.update({
      where: { id: playerCardId },
      data: {
        damageBoost: { increment: damageBoost },
        healthBoost: { increment: healthBoost },
      },
      include: {
        baseCard: true,
      },
    });

    return NextResponse.json({
      success: true,
      updatedCard,
      reward: {
        damageBoost,
        healthBoost,
      },
    });
  } catch (error) {
    console.error("Reward POST error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
