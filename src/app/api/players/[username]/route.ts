import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CardType } from "@/generated/prisma";

// Prisma client imported from singleton

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Nem vagy bejelentkezve" },
        { status: 401 }
      );
    }

    const { username } = await params;

    // Játékos keresése
    const player = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        profileVisibility: true,
        createdAt: true,
        role: true,
      },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Játékos nem található" },
        { status: 404 }
      );
    }

    // Ha nem publikus a profil és nem a saját profilunkat nézzük
    if (!player.profileVisibility && player.id !== session.user.id) {
      return NextResponse.json(
        { error: "Ez a profil privát" },
        { status: 403 }
      );
    }

    // Csak játékosok profilját lehet megtekinteni
    if (player.role !== "PLAYER") {
      return NextResponse.json(
        { error: "Csak játékosok profilját lehet megtekinteni" },
        { status: 400 }
      );
    }

    // Statisztikák összegyűjtése
    const games = await prisma.game.findMany({
      where: { userId: player.id },
      include: {
        environment: {
          select: {
            name: true,
          },
        },
        battles: {
          select: {
            status: true,
            dungeon: {
              select: {
                name: true,
                type: true,
              },
            },
            createdAt: true,
          },
        },
        playerCards: {
          include: {
            baseCard: {
              select: {
                name: true,
                boostType: true,
                baseCard: {
                  select: {
                    name: true,
                    damage: true,
                    health: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Összesítések
    const totalGames = games.length;
    const allBattles = games.flatMap((g) => g.battles);
    const totalBattles = allBattles.length;
    const wonBattles = allBattles.filter((b) => b.status === "WON").length;
    const lostBattles = allBattles.filter((b) => b.status === "LOST").length;
    const inProgressBattles = allBattles.filter(
      (b) => b.status === "IN_PROGRESS"
    ).length;
    const winRate = totalBattles > 0 ? (wonBattles / totalBattles) * 100 : 0;

    // Kazamata típusok szerinti győzelmek
    const dungeonTypeWins = {
      SIMPLE_ENCOUNTER: 0,
      SMALL_DUNGEON: 0,
      LARGE_DUNGEON: 0,
    };

    allBattles
      .filter((b) => b.status === "WON")
      .forEach((b) => {
        dungeonTypeWins[b.dungeon.type]++;
      });

    // Legutóbbi harcok (top 10)
    const recentBattles = allBattles
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((b) => ({
        dungeonName: b.dungeon.name,
        dungeonType: b.dungeon.type,
        status: b.status,
        date: b.createdAt,
      }));

    // Legmagasabb szintű kártyák (top 10)
    const allPlayerCards = games.flatMap((g) => g.playerCards);
    const topCards = allPlayerCards
      .map((pc) => ({
        name: pc.baseCard.name,
        baseDamage: pc.baseCard.baseCard.damage,
        baseHealth: pc.baseCard.baseCard.health,
        type: pc.baseCard.baseCard.type,
        totalDamage: pc.baseCard.baseCard.damage + pc.damageBoost,
        totalHealth: pc.baseCard.baseCard.health + pc.healthBoost,
        damageBoost: pc.damageBoost,
        healthBoost: pc.healthBoost,
        totalPower:
          pc.baseCard.baseCard.damage +
          pc.damageBoost +
          pc.baseCard.baseCard.health +
          pc.healthBoost,
      }))
      .sort((a, b) => b.totalPower - a.totalPower)
      .slice(0, 10);

    // Kártya típusok eloszlása
    const cardTypeDistribution: Record<CardType, number> = {
      EARTH: 0,
      AIR: 0,
      WATER: 0,
      FIRE: 0,
    };

    allPlayerCards.forEach((pc) => {
      cardTypeDistribution[pc.baseCard.baseCard.type]++;
    });

    // Kedvenc környezet (legtöbb játék)
    const environmentCounts: Record<string, number> = {};
    games.forEach((g) => {
      const envName = g.environment.name;
      environmentCounts[envName] = (environmentCounts[envName] || 0) + 1;
    });

    const favoriteEnvironment =
      Object.entries(environmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    return NextResponse.json({
      player: {
        username: player.username,
        memberSince: player.createdAt,
        isOwn: player.id === session.user.id,
      },
      statistics: {
        totalGames,
        totalBattles,
        wonBattles,
        lostBattles,
        inProgressBattles,
        winRate: Math.round(winRate * 10) / 10,
        dungeonTypeWins,
        favoriteEnvironment,
      },
      recentBattles,
      topCards,
      cardTypeDistribution,
    });
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return NextResponse.json(
      { error: "Hiba történt a profil betöltése során" },
      { status: 500 }
    );
  }
}
