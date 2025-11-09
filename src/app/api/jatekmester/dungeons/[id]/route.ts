import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Nincs jogosultságod" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const dungeon = await prisma.dungeon.findUnique({
      where: {
        id,
      },
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
          orderBy: {
            order: "asc",
          },
        },
        environment: true,
      },
    });

    if (!dungeon) {
      return NextResponse.json(
        { error: "Kazamata nem található" },
        { status: 404 }
      );
    }

    return NextResponse.json(dungeon);
  } catch (error) {
    console.error("Error fetching dungeon:", error);
    return NextResponse.json(
      { error: "Hiba történt a kazamata betöltésekor" },
      { status: 500 }
    );
  }
}


import { z } from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Nincs jogosultságod" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const DungeonSchema = z.object({
      name: z.string().min(1),
      type: z.string().min(1),
      environmentId: z.string().min(1),
      cards: z.array(z.any()).min(1),
      order: z.any().optional(),
      requiredWins: z.any().optional()
    });
    const parsed = DungeonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Érvénytelen adatok", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { name, type, environmentId, cards, order, requiredWins } = parsed.data;

    // Típus validálás
    const DUNGEON_TYPES = {
      SIMPLE_ENCOUNTER: { simple: 1, leader: 0, reward: "+1 sebzés" },
      SMALL_DUNGEON: { simple: 3, leader: 1, reward: "+2 életerő" },
      LARGE_DUNGEON: { simple: 5, leader: 1, reward: "+3 sebzés" },
    };

    if (!(type in DUNGEON_TYPES)) {
      return NextResponse.json(
        { error: "Érvénytelen kazamata típus" },
        { status: 400 }
      );
    }

    const typeInfo = DUNGEON_TYPES[type as keyof typeof DUNGEON_TYPES];
    const expectedCardCount = typeInfo.simple + typeInfo.leader;

    if (cards.length !== expectedCardCount) {
      return NextResponse.json(
        {
          error: `A(z) ${type} típushoz ${expectedCardCount} kártya szükséges`,
        },
        { status: 400 }
      );
    }

    // Progresszió validálás
    const dungeonOrder = order !== undefined ? Number(order) : 1;
    const dungeonRequiredWins =
      requiredWins !== undefined ? Number(requiredWins) : 0;

    if (
      isNaN(dungeonOrder) ||
      dungeonOrder < 1 ||
      isNaN(dungeonRequiredWins) ||
      dungeonRequiredWins < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Érvénytelen progressziós értékek (sorrend >= 1, szükséges győzelmek >= 0)",
        },
        { status: 400 }
      );
    }

    // Környezet ellenőrzése
    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!environment) {
      return NextResponse.json(
        { error: "Érvénytelen környezet" },
        { status: 400 }
      );
    }

    // Kártyák validálása
    for (const card of cards) {
      if (card.isLeader) {
        if (!card.leaderCardId) {
          return NextResponse.json(
            { error: "Minden vezérkártya slot kitöltése kötelező" },
            { status: 400 }
          );
        }
        const leaderCard = await prisma.leaderCard.findUnique({
          where: { id: card.leaderCardId },
        });
        if (!leaderCard) {
          return NextResponse.json(
            { error: "Érvénytelen vezérkártya" },
            { status: 400 }
          );
        }
      } else {
        if (!card.worldCardId) {
          return NextResponse.json(
            { error: "Minden sima kártya slot kitöltése kötelező" },
            { status: 400 }
          );
        }
        const worldCard = await prisma.worldCard.findUnique({
          where: { id: card.worldCardId },
        });
        if (!worldCard) {
          return NextResponse.json(
            { error: "Érvénytelen sima kártya" },
            { status: 400 }
          );
        }
      }
    }

    // Kazamata frissítése tranzakcióban
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedDungeon = await prisma.$transaction(async (tx: any) => {
      // Töröljük a régi kártyákat
      await tx.dungeonCard.deleteMany({
        where: {
          dungeonId: id,
        },
      });

      // Frissítjük a kazamatát és hozzáadjuk az új kártyákat
      return tx.dungeon.update({
        where: {
          id,
        },
        data: {
          name,
          type,
          environmentId,
          order: dungeonOrder,
          requiredWins: dungeonRequiredWins,
          dungeonCards: {
            create: cards.map(
              (
                card: {
                  isLeader: boolean;
                  worldCardId?: string;
                  leaderCardId?: string;
                },
                index: number
              ) => ({
                order: index + 1,
                isLeader: card.isLeader,
                worldCardId: card.isLeader ? null : card.worldCardId,
                leaderCardId: card.isLeader ? card.leaderCardId : null,
              })
            ),
          },
        },
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
            orderBy: {
              order: "asc",
            },
          },
          environment: true,
        },
      });
    });

    return NextResponse.json(updatedDungeon);
  } catch (error) {
    console.error("Error updating dungeon:", error);
    return NextResponse.json(
      { error: "Hiba történt a kazamata frissítésekor" },
      { status: 500 }
    );
  }
}
