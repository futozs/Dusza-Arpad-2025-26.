import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Gyűjtemény lekérése (vezérkártyákkal)
    const collection = await prisma.playerCard.findMany({
      where: { gameId },
      include: {
        baseCard: {
          include: {
            baseCard: true, // LeaderCard -> WorldCard kapcsolat
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ collection, game });
  } catch (error) {
    console.error("Collection GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}

// POST /api/game/[gameId]/collection - Vezérkártya hozzáadása a gyűjteményhez
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
    const { leaderCardId } = body;

    if (!leaderCardId) {
      return NextResponse.json({ error: "Hiányzó leaderCardId" }, { status: 400 });
    }

    // Ellenőrizzük, hogy a játék a felhasználóé-e
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Játék nem található" }, { status: 404 });
    }

    // Ellenőrizzük, hogy a vezérkártya létezik-e és a játék környezetéhez tartozik
    const leaderCard = await prisma.leaderCard.findFirst({
      where: {
        id: leaderCardId,
        environmentId: game.environmentId,
      },
    });

    if (!leaderCard) {
      return NextResponse.json(
        { error: "Vezérkártya nem található vagy nem tartozik a környezethez" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy már benne van-e a gyűjteményben
    const existing = await prisma.playerCard.findUnique({
      where: {
        gameId_baseCardId: {
          gameId,
          baseCardId: leaderCardId,
        },
      },
      include: {
        baseCard: {
          include: {
            baseCard: true,
          },
        },
      },
    });

    if (existing) {
      // Ha már létezik, adjuk vissza a meglévő kártyát 400-as státusszal
      return NextResponse.json(
        { error: "Ez a vezérkártya már a gyűjteményben van", card: existing },
        { status: 400 }
      );
    }

    // Vezérkártya hozzáadása a gyűjteményhez
    try {
      const playerCard = await prisma.playerCard.create({
        data: {
          gameId,
          baseCardId: leaderCardId,
        },
        include: {
          baseCard: {
            include: {
              baseCard: true, // Vezérkártya alapkártyája (WorldCard)
            },
          },
        },
      });

      return NextResponse.json(playerCard, { status: 201 });
    } catch (createError: unknown) {
      // Ha mégis unique constraint error történik (race condition),
      // próbáljuk meg újra lekérdezni a kártyát
      if (createError && typeof createError === 'object' && 'code' in createError && createError.code === 'P2002') {
        const existingCard = await prisma.playerCard.findUnique({
          where: {
            gameId_baseCardId: {
              gameId,
              baseCardId: leaderCardId,
            },
          },
          include: {
            baseCard: {
              include: {
                baseCard: true,
              },
            },
          },
        });

        return NextResponse.json(
          { error: "Ez a vezérkártya már a gyűjteményben van", card: existingCard },
          { status: 400 }
        );
      }
      
      // Ha más hiba történt, dobjuk tovább
      throw createError;
    }
  } catch (error) {
    console.error("Collection POST error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
