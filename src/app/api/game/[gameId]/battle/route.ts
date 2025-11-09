import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CardType, ClashWinner, ClashWinReason, BattleStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { 
  updateStatsOnBattleStart, 
  updateStatsOnClash, 
  updateStatsOnBattleEnd 
} from "@/lib/stats";

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

// Ütközet kiértékelése - DOKUMENTÁCIÓ SZERINT!
// 1. Sebzés alapján: kártya nyer ha sebzése > ellenfél életereje
// 2. Ha ez alapján nincs egyértelmű győztes, típus előny
// 3. Ha ez alapján sincs, kazamata nyer
function evaluateClash(
  playerDamage: number,
  playerHealth: number,
  playerType: CardType,
  dungeonDamage: number,
  dungeonHealth: number,
  dungeonType: CardType
): { winner: ClashWinner; reason: ClashWinReason } {
  // Debug log
  console.log("=== CLASH EVALUATION ===");
  console.log("Player:", { damage: playerDamage, health: playerHealth, type: playerType });
  console.log("Dungeon:", { damage: dungeonDamage, health: dungeonHealth, type: dungeonType });
  
  // 1. Sebzés vs életerő - DOKUMENTÁCIÓ SZERINT
  // "Két kártya közül az nyer, amelyiknek a sebzés értéke nagyobb a másik kártya életerejénél"
  const playerDefeatsEnemy = playerDamage > dungeonHealth;
  const dungeonDefeatsPlayer = dungeonDamage > playerHealth;

  console.log("Sebzés check:", { 
    playerDefeatsEnemy: `${playerDamage} > ${dungeonHealth} = ${playerDefeatsEnemy}`,
    dungeonDefeatsPlayer: `${dungeonDamage} > ${playerHealth} = ${dungeonDefeatsPlayer}`
  });

  // Ha csak az egyik kártya győz sebzés alapján
  if (playerDefeatsEnemy && !dungeonDefeatsPlayer) {
    console.log("Result: PLAYER wins by DAMAGE");
    return { winner: "PLAYER", reason: "DAMAGE" };
  }
  if (dungeonDefeatsPlayer && !playerDefeatsEnemy) {
    console.log("Result: DUNGEON wins by DAMAGE");
    return { winner: "DUNGEON", reason: "DAMAGE" };
  }

  // 2. Típus előny - ha sebzés alapján nincs egyértelmű győztes
  // "Ha nem lehet eldönteni a győztest ez alapján, akkor a kártyák típusa határozza meg"
  const playerHasTypeAdvantage = getTypeAdvantage(playerType, dungeonType);
  const dungeonHasTypeAdvantage = getTypeAdvantage(dungeonType, playerType);

  console.log("Típus check:", {
    playerHasTypeAdvantage,
    dungeonHasTypeAdvantage
  });

  if (playerHasTypeAdvantage && !dungeonHasTypeAdvantage) {
    console.log("Result: PLAYER wins by TYPE_ADVANTAGE");
    return { winner: "PLAYER", reason: "TYPE_ADVANTAGE" };
  }
  if (dungeonHasTypeAdvantage && !playerHasTypeAdvantage) {
    console.log("Result: DUNGEON wins by TYPE_ADVANTAGE");
    return { winner: "DUNGEON", reason: "TYPE_ADVANTAGE" };
  }

  // 3. Döntetlen -> kazamata nyer (dokumentáció szerint)
  console.log("Result: DUNGEON wins by DEFAULT (döntetlen)");
  return { winner: "DUNGEON", reason: "DEFAULT" };
}

// POST /api/game/[gameId]/battle - Új harc indítása

import { z } from "zod";

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
    const BattleSchema = z.object({ dungeonId: z.string().min(1) });
    const parsed = BattleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Érvénytelen adatok", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { dungeonId } = parsed.data;

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
                baseCard: {
                  include: {
                    baseCard: true, // LeaderCard -> WorldCard
                  },
                },
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

    // DOKUMENTÁCIÓ SZERINT: "Csak akkor indul el a harc, ha a játékos által korábban 
    // összeállított pakli kártyáinak száma megegyezik a kiválasztott kazamata kártyáinak számával"
    // Tehát PONTOS egyenlőség kell, nem csak >=
    if (deck.deckCards.length !== dungeon.dungeonCards.length) {
      return NextResponse.json(
        {
          error: `A pakli kártyaszámának meg kell egyeznie a kazamata kártyaszámával! (Pakli: ${deck.deckCards.length}, Kazamata: ${dungeon.dungeonCards.length})`,
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

    // Pontosan annyi kártya van a pakliból mint a kazamatából (ezt már ellenőriztük)
    const cardsToUse = dungeon.dungeonCards.length;
    
    // Statisztika: harc kezdés
    await updateStatsOnBattleStart(session.user.id);
    
    const battleStartTime = Date.now();
    
    for (let i = 0; i < cardsToUse; i++) {
      const playerDeckCard = deck.deckCards[i];
      const dungeonCard = dungeon.dungeonCards[i];

      // Játékos kártya adatai (PlayerCard -> LeaderCard -> WorldCard)
      const playerCard = playerDeckCard.playerCard;
      const playerLeaderCard = playerCard.baseCard; // LeaderCard
      const playerWorldCard = playerLeaderCard.baseCard; // WorldCard
      
      // Alap értékek a WorldCard-ból + boostok a PlayerCard-ból
      const playerDamage = playerWorldCard.damage + (playerCard.damageBoost || 0);
      const playerHealth = playerWorldCard.health + (playerCard.healthBoost || 0);
      const playerType = playerWorldCard.type;
      const playerName = playerLeaderCard.name;

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
      
      // Statisztika: ütközet után
      await updateStatsOnClash(session.user.id, {
        winner: result.winner,
        winReason: result.reason,
        playerDamage,
        playerHealth,
        dungeonDamage,
        dungeonHealth,
        playerCardType: playerType,
      });
    }

    // Harc eredménye - DOKUMENTÁCIÓ SZERINT
    // "A játékos akkor nyer a harc végén, ha összességében legalább annyi kártyája nyert mint amennyi a kazamatának"
    // De döntetlen esetén (ugyanannyi) az nem számít győzelemnek
    const status: BattleStatus = 
      playerWins > dungeonWins 
        ? "WON" 
        : playerWins === dungeonWins 
        ? "DRAW" 
        : "LOST";
    
    // Harc ideje (másodpercben -> percre konvertálva)
    const battleDuration = Math.ceil((Date.now() - battleStartTime) / 1000 / 60);

    // Statisztika: harc vége
    await updateStatsOnBattleEnd(session.user.id, {
      status,
      dungeonType: dungeon.type,
      battleDuration,
    });

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
        game: {
          select: {
            name: true,
          },
        },
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
