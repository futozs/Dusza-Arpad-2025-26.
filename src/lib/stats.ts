import { prisma } from "./prisma";
import { CardType, ClashWinner, BattleStatus, DungeonType } from "@/generated/prisma";

/**
 * Statisztika kezelő szolgáltatás
 * Minden játékbeli eseményt rögzít és statisztikát vezet
 */

// Inicializálja a statisztikát egy új felhasználónak
export async function initializePlayerStats(userId: string) {
  const existingStats = await prisma.playerStats.findUnique({
    where: { userId },
  });

  if (existingStats) {
    return existingStats;
  }

  return await prisma.playerStats.create({
    data: {
      userId,
    },
  });
}

// Frissíti a statisztikát amikor új játékot indítanak
export async function updateStatsOnGameStart(userId: string) {
  await initializePlayerStats(userId);
  
  return await prisma.playerStats.update({
    where: { userId },
    data: {
      totalGamesPlayed: { increment: 1 },
    },
  });
}

// Frissíti a statisztikát amikor új harcot indítanak
export async function updateStatsOnBattleStart(userId: string) {
  await initializePlayerStats(userId);
  
  return await prisma.playerStats.update({
    where: { userId },
    data: {
      totalBattlesPlayed: { increment: 1 },
    },
  });
}

// Frissíti a statisztikát egy ütközet után
export async function updateStatsOnClash(
  userId: string,
  clashData: {
    winner: ClashWinner;
    winReason: string;
    playerDamage: number;
    playerHealth: number;
    dungeonDamage: number;
    dungeonHealth: number;
    playerCardType: CardType;
  }
) {
  await initializePlayerStats(userId);
  
  const isPlayerWin = clashData.winner === "PLAYER";
  
  // Alapvető statisztikák
  const updateData: Record<string, unknown> = {
    totalClashes: { increment: 1 },
    totalDamageDealt: { increment: clashData.playerDamage },
    totalDamageTaken: { increment: clashData.dungeonDamage },
    totalHealthUsed: { increment: clashData.playerHealth },
  };

  // Győzelem/vereség számláló
  if (isPlayerWin) {
    updateData.totalClashesWon = { increment: 1 };
    
    // Győzelmi ok szerinti statisztika
    if (clashData.winReason === "DAMAGE") {
      updateData.clashesWonByDamage = { increment: 1 };
    } else if (clashData.winReason === "TYPE_ADVANTAGE") {
      updateData.clashesWonByType = { increment: 1 };
    }
    
    // Kártya típus szerinti győzelmek
    switch (clashData.playerCardType) {
      case "FIRE":
        updateData.fireCardWins = { increment: 1 };
        break;
      case "WATER":
        updateData.waterCardWins = { increment: 1 };
        break;
      case "EARTH":
        updateData.earthCardWins = { increment: 1 };
        break;
      case "AIR":
        updateData.airCardWins = { increment: 1 };
        break;
    }
  } else {
    updateData.totalClashesLost = { increment: 1 };
    
    if (clashData.winReason === "DEFAULT") {
      updateData.clashesLostByDefault = { increment: 1 };
    }
    
    // Kártya típus szerinti vereségek
    switch (clashData.playerCardType) {
      case "FIRE":
        updateData.fireCardLosses = { increment: 1 };
        break;
      case "WATER":
        updateData.waterCardLosses = { increment: 1 };
        break;
      case "EARTH":
        updateData.earthCardLosses = { increment: 1 };
        break;
      case "AIR":
        updateData.airCardLosses = { increment: 1 };
        break;
    }
  }

  // Rekord sebzés frissítése
  const currentStats = await prisma.playerStats.findUnique({
    where: { userId },
  });
  
  if (currentStats && clashData.playerDamage > currentStats.highestDamageInClash) {
    updateData.highestDamageInClash = clashData.playerDamage;
  }

  return await prisma.playerStats.update({
    where: { userId },
    data: updateData,
  });
}

// Frissíti a statisztikát egy harc befejezése után
export async function updateStatsOnBattleEnd(
  userId: string,
  battleData: {
    status: BattleStatus;
    dungeonType: DungeonType;
    battleDuration?: number; // perc
  }
) {
  await initializePlayerStats(userId);
  
  const isWin = battleData.status === "WON";
  
  const updateData: Record<string, unknown> = {};

  // Győzelem/vereség
  if (isWin) {
    updateData.totalBattlesWon = { increment: 1 };
    updateData.totalDungeonsCompleted = { increment: 1 };
    
    // Kazamata típus szerinti statisztika
    switch (battleData.dungeonType) {
      case "SIMPLE_ENCOUNTER":
        updateData.simpleDungeonsCompleted = { increment: 1 };
        break;
      case "SMALL_DUNGEON":
        updateData.smallDungeonsCompleted = { increment: 1 };
        break;
      case "LARGE_DUNGEON":
        updateData.largeDungeonsCompleted = { increment: 1 };
        break;
    }
  } else {
    updateData.totalBattlesLost = { increment: 1 };
  }

  // Win/Lose streak kezelés
  const currentStats = await prisma.playerStats.findUnique({
    where: { userId },
  });

  if (currentStats) {
    if (isWin) {
      // Győzelmi sorozat
      const newWinStreak = currentStats.currentWinStreak + 1;
      updateData.currentWinStreak = newWinStreak;
      updateData.currentLoseStreak = 0;
      
      if (newWinStreak > currentStats.longestWinStreak) {
        updateData.longestWinStreak = newWinStreak;
      }
    } else {
      // Vesztes sorozat
      const newLoseStreak = currentStats.currentLoseStreak + 1;
      updateData.currentLoseStreak = newLoseStreak;
      updateData.currentWinStreak = 0;
      
      if (newLoseStreak > currentStats.longestLoseStreak) {
        updateData.longestLoseStreak = newLoseStreak;
      }
    }

    // Idő statisztikák
    if (battleData.battleDuration) {
      updateData.totalPlayTimeMinutes = { increment: battleData.battleDuration };
      
      const totalBattles = currentStats.totalBattlesPlayed + 1;
      const totalTime = currentStats.totalPlayTimeMinutes + battleData.battleDuration;
      updateData.averageBattleTime = Math.round(totalTime / totalBattles);
      
      // Leggyorsabb győzelem
      if (isWin) {
        if (currentStats.fastestBattleWin === 0 || battleData.battleDuration < currentStats.fastestBattleWin) {
          updateData.fastestBattleWin = battleData.battleDuration;
        }
      }
    }
  }

  return await prisma.playerStats.update({
    where: { userId },
    data: updateData,
  });
}

// Frissíti a statisztikát kártya fejlesztéskor
export async function updateStatsOnCardUpgrade(
  userId: string,
  upgradeData: {
    damageBoost?: number;
    healthBoost?: number;
  }
) {
  await initializePlayerStats(userId);
  
  const updateData: Record<string, unknown> = {
    totalCardUpgrades: { increment: 1 },
  };

  if (upgradeData.damageBoost) {
    updateData.totalDamageUpgrades = { increment: upgradeData.damageBoost };
  }

  if (upgradeData.healthBoost) {
    updateData.totalHealthUpgrades = { increment: upgradeData.healthBoost };
  }

  return await prisma.playerStats.update({
    where: { userId },
    data: updateData,
  });
}

// Frissíti a statisztikát új kártya megszerzésekor
export async function updateStatsOnCardCollected(userId: string) {
  await initializePlayerStats(userId);
  
  return await prisma.playerStats.update({
    where: { userId },
    data: {
      totalCardsCollected: { increment: 1 },
    },
  });
}

// Frissíti a statisztikát új pakli létrehozásakor
export async function updateStatsOnDeckCreated(userId: string, deckId: string) {
  await initializePlayerStats(userId);
  
  return await prisma.playerStats.update({
    where: { userId },
    data: {
      totalDecksCreated: { increment: 1 },
      mostUsedDeckId: deckId, // Legutóbb létrehozott paklit állítjuk be
    },
  });
}

// Frissíti a legtöbbet használt paklit
export async function updateMostUsedDeck(userId: string, deckId: string) {
  await initializePlayerStats(userId);
  
  // TODO: Implementálhatunk egy számláló rendszert is, hogy tényleg a legtöbbet használtat tárolja
  return await prisma.playerStats.update({
    where: { userId },
    data: {
      mostUsedDeckId: deckId,
    },
  });
}

// Frissíti az új környezet statisztikát
export async function updateStatsOnNewEnvironment(userId: string) {
  await initializePlayerStats(userId);
  
  return await prisma.playerStats.update({
    where: { userId },
    data: {
      totalEnvironmentsPlayed: { increment: 1 },
    },
  });
}

// Lekéri egy játékos teljes statisztikáját
export async function getPlayerStats(userId: string) {
  const stats = await prisma.playerStats.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          username: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!stats) {
    return await initializePlayerStats(userId);
  }

  return stats;
}

// Lekéri a toplista adatokat (pl. legtöbb győzelem)
export async function getLeaderboard(
  stat: string = 'totalBattlesWon',
  limit: number = 10
) {
  // Biztonsági ellenőrzés: csak engedélyezett statisztikákat fogadunk el
  const allowedStats = [
    'totalBattlesWon',
    'totalDungeonsCompleted',
    'totalClashesWon',
    'totalDamageDealt',
    'longestWinStreak',
    'totalGamesPlayed',
    'totalBattlesPlayed',
  ];
  
  const orderByStat = allowedStats.includes(stat) ? stat : 'totalBattlesWon';
  
  return await prisma.playerStats.findMany({
    take: limit,
    orderBy: {
      [orderByStat]: 'desc',
    },
    include: {
      user: {
        select: {
          username: true,
          profileVisibility: true,
        },
      },
    },
    where: {
      user: {
        profileVisibility: true, // Csak publikus profilok
      },
    },
  });
}

// Számolt statisztikák (win rate, stb.)
export async function getCalculatedStats(userId: string) {
  const stats = await getPlayerStats(userId);
  
  const winRate = stats.totalBattlesPlayed > 0 
    ? ((stats.totalBattlesWon / stats.totalBattlesPlayed) * 100).toFixed(2)
    : "0.00";
    
  const clashWinRate = stats.totalClashes > 0
    ? ((stats.totalClashesWon / stats.totalClashes) * 100).toFixed(2)
    : "0.00";
    
  const averageDamagePerClash = stats.totalClashes > 0
    ? Math.round(stats.totalDamageDealt / stats.totalClashes)
    : 0;
    
  const favoriteCardType = getFavoriteCardType(stats);
  
  return {
    ...stats,
    winRate: parseFloat(winRate),
    clashWinRate: parseFloat(clashWinRate),
    averageDamagePerClash,
    favoriteCardType,
  };
}

// Meghatározza a kedvenc kártya típust
function getFavoriteCardType(stats: {
  fireCardWins: number;
  waterCardWins: number;
  earthCardWins: number;
  airCardWins: number;
}): CardType | null {
  const types = {
    FIRE: stats.fireCardWins,
    WATER: stats.waterCardWins,
    EARTH: stats.earthCardWins,
    AIR: stats.airCardWins,
  };
  
  let maxWins = 0;
  let favoriteType: CardType | null = null;
  
  for (const [type, wins] of Object.entries(types)) {
    if (wins > maxWins) {
      maxWins = wins;
      favoriteType = type as CardType;
    }
  }
  
  return favoriteType;
}
