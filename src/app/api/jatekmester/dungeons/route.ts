import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/jatekmester/dungeons
 * 
 * Kazamaták listázása (admin)
 * - Visszaadja az összes kazamatát a hozzá tartozó kártyákkal
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Unauthorized - csak jatekmester férhet hozzá" },
        { status: 403 }
      );
    }

    const dungeons = await prisma.dungeon.findMany({
      include: {
        environment: true,
        dungeonCards: {
          include: {
            worldCard: true,
            leaderCard: {
              include: {
                baseCard: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(dungeons);
  } catch (error) {
    console.error("Error fetching dungeons:", error);
    return NextResponse.json(
      { error: "Hiba történt a kazamaták lekérdezése során" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jatekmester/dungeons
 * 
 * Új kazamata létrehozása
 * - Név validálás (egyedi)
 * - Típus alapján megfelelő számú kártya validálása
 * - SIMPLE_ENCOUNTER: 1 sima kártya
 * - SMALL_DUNGEON: 3 sima + 1 vezér
 * - LARGE_DUNGEON: 5 sima + 1 vezér
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Unauthorized - csak jatekmester férhet hozzá" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type, environmentId, cards, order, requiredWins } = body;

    // Típus definíció a kártyák számára
    interface DungeonCardInput {
      isLeader: boolean;
      worldCardId?: string;
      leaderCardId?: string;
    }

    // Validáció
    if (!name || !type || !environmentId || !cards || !Array.isArray(cards)) {
      return NextResponse.json(
        { error: "Hiányzó vagy érvénytelen mezők" },
        { status: 400 }
      );
    }

    // Order és requiredWins validálás
    const dungeonOrder = order !== undefined ? Number(order) : 0;
    const dungeonRequiredWins = requiredWins !== undefined ? Number(requiredWins) : 0;

    if (isNaN(dungeonOrder) || dungeonOrder < 0) {
      return NextResponse.json(
        { error: "Érvénytelen sorrend érték (0 vagy pozitív szám kell)" },
        { status: 400 }
      );
    }

    if (isNaN(dungeonRequiredWins) || dungeonRequiredWins < 0) {
      return NextResponse.json(
        { error: "Érvénytelen szükséges győzelmek érték (0 vagy pozitív szám kell)" },
        { status: 400 }
      );
    }

    // Cast to proper type
    const dungeonCards = cards as DungeonCardInput[];

    // Név egyediség ellenőrzése
    const existingDungeon = await prisma.dungeon.findUnique({
      where: { name },
    });

    if (existingDungeon) {
      return NextResponse.json(
        { error: "Ez a kazamata név már létezik" },
        { status: 400 }
      );
    }

    // Típus alapján validálni a kártyák számát
    const requiredCards: Record<string, { simple: number; leader: number }> = {
      SIMPLE_ENCOUNTER: { simple: 1, leader: 0 },
      SMALL_DUNGEON: { simple: 3, leader: 1 },
      LARGE_DUNGEON: { simple: 5, leader: 1 },
    };

    const required = requiredCards[type];
    if (!required) {
      return NextResponse.json(
        { error: "Érvénytelen kazamata típus" },
        { status: 400 }
      );
    }

    const simpleCount = dungeonCards.filter((c) => !c.isLeader).length;
    const leaderCount = dungeonCards.filter((c) => c.isLeader).length;

    if (simpleCount !== required.simple || leaderCount !== required.leader) {
      return NextResponse.json(
        { 
          error: `${type} típusú kazamatához ${required.simple} sima kártya és ${required.leader} vezérkártya szükséges. Megadva: ${simpleCount} sima, ${leaderCount} vezér.` 
        },
        { status: 400 }
      );
    }

    // Kis és Nagy kazamata esetén az utolsó kártyának vezérnek kell lennie
    if ((type === "SMALL_DUNGEON" || type === "LARGE_DUNGEON") && !dungeonCards[dungeonCards.length - 1].isLeader) {
      return NextResponse.json(
        { error: "Kis és Nagy kazamata esetén az utolsó kártyának vezérnek kell lennie" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy ugyanaz a sima kártya ne szerepeljen többször
    const simpleCardIds = dungeonCards.filter((c) => !c.isLeader).map((c) => c.worldCardId);
    const uniqueSimpleCardIds = [...new Set(simpleCardIds)];
    if (simpleCardIds.length !== uniqueSimpleCardIds.length) {
      return NextResponse.json(
        { error: "Ugyanaz a sima kártya csak egyszer szerepelhet egy kazamatában" },
        { status: 400 }
      );
    }

    // Kazamata létrehozása a kártyákkal
    const dungeon = await prisma.dungeon.create({
      data: {
        name,
        type,
        environmentId,
        order: dungeonOrder,
        requiredWins: dungeonRequiredWins,
        dungeonCards: {
          create: dungeonCards.map((card, index: number) => ({
            order: index,
            isLeader: card.isLeader,
            worldCardId: card.isLeader ? null : card.worldCardId,
            leaderCardId: card.isLeader ? card.leaderCardId : null,
          })),
        },
      },
      include: {
        environment: true,
        dungeonCards: {
          include: {
            worldCard: true,
            leaderCard: {
              include: {
                baseCard: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(dungeon, { status: 201 });
  } catch (error) {
    console.error("Error creating dungeon:", error);
    return NextResponse.json(
      { error: "Hiba történt a kazamata létrehozása során" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/jatekmester/dungeons?id=xxx
 * 
 * Kazamata törlése
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Unauthorized - csak jatekmester férhet hozzá" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó kazamata ID" },
        { status: 400 }
      );
    }

    await prisma.dungeon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kazamata sikeresen törölve" });
  } catch (error) {
    console.error("Error deleting dungeon:", error);
    return NextResponse.json(
      { error: "Hiba történt a kazamata törlése során" },
        { status: 500 }
    );
  }
}
