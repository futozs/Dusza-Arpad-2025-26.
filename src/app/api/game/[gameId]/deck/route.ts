import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/game/[gameId]/deck - Aktív pakli lekérése
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
    });

    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Játék nem található" }, { status: 404 });
    }

    // Aktív pakli lekérése
    const deck = await prisma.deck.findFirst({
      where: {
        gameId,
        isActive: true,
      },
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
    });

    return NextResponse.json(deck);
  } catch (error) {
    console.error("Deck GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}

// POST /api/game/[gameId]/deck - Új pakli összeállítása
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
    const { name, playerCardIds } = body; // playerCardIds: [id1, id2, ...]

    if (!playerCardIds || !Array.isArray(playerCardIds) || playerCardIds.length === 0) {
      return NextResponse.json({ error: "Hiányzó vagy hibás playerCardIds" }, { status: 400 });
    }

    // Maximum 6 kártya egy pakliban (5+1)
    if (playerCardIds.length > 6) {
      return NextResponse.json({ error: "Egy pakliba maximum 6 kártya tehető" }, { status: 400 });
    }

    // Ellenőrizzük, hogy a játék a felhasználóé-e
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Játék nem található" }, { status: 404 });
    }

    // Ellenőrizzük, hogy minden kártya a játékos gyűjteményéből van-e
    const playerCards = await prisma.playerCard.findMany({
      where: {
        id: { in: playerCardIds },
        gameId,
      },
    });

    if (playerCards.length !== playerCardIds.length) {
      return NextResponse.json(
        { error: "Nem minden kártya található a gyűjteményben" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy nincs-e duplikált kártya
    const uniqueIds = new Set(playerCardIds);
    if (uniqueIds.size !== playerCardIds.length) {
      return NextResponse.json(
        { error: "Ugyanaz a kártya nem szerepelhet többször a pakliban" },
        { status: 400 }
      );
    }

    // Tranzakció: régi paklik inaktiválása és új pakli létrehozása
    const deck = await prisma.$transaction(async (tx) => {
      // Régi paklik inaktiválása
      await tx.deck.updateMany({
        where: {
          gameId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // Új pakli létrehozása
      const newDeck = await tx.deck.create({
        data: {
          gameId,
          name: name || "Pakli",
          isActive: true,
          deckCards: {
            create: playerCardIds.map((playerCardId: string, index: number) => ({
              playerCardId,
              order: index,
            })),
          },
        },
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
      });

      return newDeck;
    });

    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    console.error("Deck POST error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
