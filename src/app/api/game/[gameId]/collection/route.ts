import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/game/[gameId]/collection - Játékos gyűjteményének lekérése
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const { gameId } = await params;

    // Ellenőrizzük, hogy a játék a felhasználóé-e
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { environment: true },
    });

    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Játék nem található" }, { status: 404 });
    }

    // Gyűjtemény lekérése
    const collection = await prisma.playerCard.findMany({
      where: { gameId },
      include: {
        baseCard: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ collection, game });
  } catch (error) {
    console.error("Collection GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}

// POST /api/game/[gameId]/collection - Kártya hozzáadása a gyűjteményhez
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const { gameId } = await params;
    const body = await request.json();
    const { worldCardId } = body;

    if (!worldCardId) {
      return NextResponse.json({ error: "Hiányzó worldCardId" }, { status: 400 });
    }

    // Ellenőrizzük, hogy a játék a felhasználóé-e
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Játék nem található" }, { status: 404 });
    }

    // Ellenőrizzük, hogy a kártya létezik-e és a játék környezetéhez tartozik
    const worldCard = await prisma.worldCard.findFirst({
      where: {
        id: worldCardId,
        environmentId: game.environmentId,
      },
    });

    if (!worldCard) {
      return NextResponse.json(
        { error: "Kártya nem található vagy nem tartozik a környezethez" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy már benne van-e a gyűjteményben
    const existing = await prisma.playerCard.findUnique({
      where: {
        gameId_baseCardId: {
          gameId,
          baseCardId: worldCardId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ez a kártya már a gyűjteményben van" },
        { status: 400 }
      );
    }

    // Kártya hozzáadása a gyűjteményhez
    const playerCard = await prisma.playerCard.create({
      data: {
        gameId,
        baseCardId: worldCardId,
      },
      include: {
        baseCard: true,
      },
    });

    return NextResponse.json(playerCard, { status: 201 });
  } catch (error) {
    console.error("Collection POST error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
