import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateStatsOnGameStart } from "@/lib/stats";

// GET /api/game - Játékos játékainak lekérése
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const games = await prisma.game.findMany({
      where: { userId: session.user.id },
      include: {
        environment: true,
        _count: {
          select: {
            playerCards: true,
            decks: true,
            battles: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Game GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}

// POST /api/game - új játék létrehozása
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    const { name, environmentId } = body;

    if (!name || !environmentId) {
      return NextResponse.json({ error: "Hiányzó adatok" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e a környezet
    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!environment) {
      return NextResponse.json({ error: "A környezet nem létezik" }, { status: 400 });
    }

    // Játék létrehozása
    const game = await prisma.game.create({
      data: {
        name,
        userId: session.user.id,
        environmentId,
      },
      include: {
        environment: true,
      },
    });
    
    // Statisztika: új játék
    await updateStatsOnGameStart(session.user.id);

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Game POST error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
