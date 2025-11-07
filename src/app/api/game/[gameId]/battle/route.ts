import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient, CardType, ClashWinner, ClashWinReason, BattleStatus } from "@/generated/prisma";

const prisma = new PrismaClient();

// Típus előnyök meghatározása
function getTypeAdvantage(attackerType: CardType, defenderType: CardType): boolean {
  const advantages: Record<CardType, CardType> = {
    FIRE: "EARTH",
    EARTH: "WATER",
    WATER: "AIR",
    AIR: "FIRE",
  };
  
  return advantages[attackerType] === defenderType;
}

// Ütközet kiértékelése
function evaluateClash(
  playerDamage: number,
  playerHealth: number,
  playerType: CardType,
  dungeonDamage: number,
  dungeonHealth: number,
  dungeonType: CardType
): { winner: ClashWinner; reason: ClashWinReason } {
  // 1. Sebzés vs életerő
  const playerWinsByDamage = playerDamage > dungeonHealth;
  const dungeonWinsByDamage = dungeonDamage > playerHealth;

  if (playerWinsByDamage && !dungeonWinsByDamage) {
    return { winner: "PLAYER", reason: "DAMAGE" };
  }
  if (dungeonWinsByDamage && !playerWinsByDamage) {
    return { winner: "DUNGEON", reason: "DAMAGE" };
  }

  // 2. Típus előny
  const playerHasTypeAdvantage = getTypeAdvantage(playerType, dungeonType);
  const dungeonHasTypeAdvantage = getTypeAdvantage(dungeonType, playerType);

  if (playerHasTypeAdvantage && !dungeonHasTypeAdvantage) {
    return { winner: "PLAYER", reason: "TYPE_ADVANTAGE" };
  }
  if (dungeonHasTypeAdvantage && !playerHasTypeAdvantage) {
    return { winner: "DUNGEON", reason: "TYPE_ADVANTAGE" };
  }

  // 3. Döntetlen -> kazamata nyer
  return { winner: "DUNGEON", reason: "DEFAULT" };
}

// POST /api/game/[gameId]/battle - Új harc indítása
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
    const { dungeonId } = body;

    if (!dungeonId) {
      return NextResponse.json({ error: "Hiányzó dungeonId" }, { status: 400 });
    }

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

    if (!deck || deck.deckCards.length === 0) {
      return NextResponse.json(
        { error: "Nincs összeállított pakli" },
        { status: 400 }
      );
    }

    // Kazamata lekérése
    const dungeon = await prisma.dungeon.findUnique({
      where: { id: dungeonId },
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
    });

    if (!dungeon) {
      return NextResponse.json({ error: "Kazamata nem található" }, { status: 404 });
    }

    // Ellenőrizzük, hogy a kazamata a játék környezetéhez tartozik
    if (dungeon.environmentId !== game.environmentId) {
      return NextResponse.json(
        { error: "A kazamata nem tartozik a játék környezetéhez" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy a pakli és a kazamata kártyáinak száma megegyezik
    if (deck.deckCards.length !== dungeon.dungeonCards.length) {
      return NextResponse.json(
        {
          error: `A pakli kártyáinak száma (${deck.deckCards.length}) nem egyezik a kazamata kártyáival (${dungeon.dungeonCards.length})`,
        },
        { status: 400 }
      );
    }

    // Harc szimulálása
    const clashes: Array<{
      order: number;
      winner: ClashWinner;
      winReason: ClashWinReason;
      playerDamage: number;
      playerHealth: number;
      playerCardName: string;
      playerCardType: CardType;
      dungeonDamage: number;
      dungeonHealth: number;
      dungeonCardName: string;
      dungeonCardType: CardType;
    }> = [];

    let playerWins = 0;
    let dungeonWins = 0;

    for (let i = 0; i < deck.deckCards.length; i++) {
      const playerDeckCard = deck.deckCards[i];
      const dungeonCard = dungeon.dungeonCards[i];

      // Játékos kártya adatai (alap + boost)
      const playerBase = playerDeckCard.playerCard.baseCard;
      const playerDamage = playerBase.damage + playerDeckCard.playerCard.damageBoost;
      const playerHealth = playerBase.health + playerDeckCard.playerCard.healthBoost;
      const playerType = playerBase.type;
      const playerName = playerBase.name;

      // Kazamata kártya adatai
      let dungeonDamage: number;
      let dungeonHealth: number;
      let dungeonType: CardType;
      let dungeonName: string;

      if (dungeonCard.isLeader && dungeonCard.leaderCard) {
        // Vezérkártya
        const leaderCard = dungeonCard.leaderCard;
        const baseCard = leaderCard.baseCard;
        
        if (leaderCard.boostType === "DAMAGE_DOUBLE") {
          dungeonDamage = baseCard.damage * 2;
          dungeonHealth = baseCard.health;
        } else {
          // HEALTH_DOUBLE
          dungeonDamage = baseCard.damage;
          dungeonHealth = baseCard.health * 2;
        }
        
        dungeonType = baseCard.type;
        dungeonName = leaderCard.name;
      } else if (dungeonCard.worldCard) {
        // Sima kártya
        const worldCard = dungeonCard.worldCard;
        dungeonDamage = worldCard.damage;
        dungeonHealth = worldCard.health;
        dungeonType = worldCard.type;
        dungeonName = worldCard.name;
      } else {
        return NextResponse.json(
          { error: "Hibás kazamata kártya konfiguráció" },
          { status: 500 }
        );
      }

      // Ütközet kiértékelése
      const result = evaluateClash(
        playerDamage,
        playerHealth,
        playerType,
        dungeonDamage,
        dungeonHealth,
        dungeonType
      );

      clashes.push({
        order: i,
        winner: result.winner,
        winReason: result.reason,
        playerDamage,
        playerHealth,
        playerCardName: playerName,
        playerCardType: playerType,
        dungeonDamage,
        dungeonHealth,
        dungeonCardName: dungeonName,
        dungeonCardType: dungeonType,
      });

      if (result.winner === "PLAYER") {
        playerWins++;
      } else {
        dungeonWins++;
      }
    }

    // Harc eredménye
    const totalCards = dungeon.dungeonCards.length;
    const status: BattleStatus = playerWins >= totalCards / 2 ? "WON" : "LOST";

    // Harc mentése az adatbázisba
    const battle = await prisma.battle.create({
      data: {
        gameId,
        deckId: deck.id,
        dungeonId,
        status,
        playerWins,
        dungeonWins,
        clashes: {
          create: clashes,
        },
      },
      include: {
        clashes: {
          orderBy: { order: "asc" },
        },
        dungeon: true,
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
      },
    });

    return NextResponse.json({ battle, needsReward: status === "WON" }, { status: 201 });
  } catch (error) {
    console.error("Battle POST error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}

// GET /api/game/[gameId]/battle - Játék harcainak lekérése
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

    // Harcok lekérése
    const battles = await prisma.battle.findMany({
      where: { gameId },
      include: {
        dungeon: true,
        clashes: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(battles);
  } catch (error) {
    console.error("Battle GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
