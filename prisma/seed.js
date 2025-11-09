const { PrismaClient } = require("../src/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adatbázis feltöltése kezdődik...");

  // Töröljük a meglévő adatokat (opcionális, óvatosan!)
  console.log("🗑️  Meglévő adatok törlése...");
  await prisma.clash.deleteMany({});
  await prisma.battle.deleteMany({});
  await prisma.deckCard.deleteMany({});
  await prisma.deck.deleteMany({});
  await prisma.playerCard.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.dungeonCard.deleteMany({});
  await prisma.dungeon.deleteMany({});
  await prisma.leaderCard.deleteMany({});
  await prisma.worldCard.deleteMany({});
  await prisma.environment.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.playerStats.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash jelszó (123456789)
  const password = await bcrypt.hash("123456789", 10);

  // ============================================
  // 1. FELHASZNÁLÓK LÉTREHOZÁSA
  // ============================================
  console.log("👥 Felhasználók létrehozása...");

  const admin = await prisma.user.create({
    data: {
      email: "admin@damareen.hu",
      username: "Admin",
      password,
      role: "WEBMASTER",
      emailVerified: true,
      twoFactorEnabled: false,
    },
  });

  const webmaster = await prisma.user.create({
    data: {
      email: "webmaster@damareen.hu",
      username: "Webmester",
      password,
      role: "WEBMASTER",
      emailVerified: true,
      twoFactorEnabled: false,
    },
  });

  const player1 = await prisma.user.create({
    data: {
      email: "jatekos1@damareen.hu",
      username: "DragonSlayer",
      password,
      role: "PLAYER",
      emailVerified: true,
      profileVisibility: true,
    },
  });

  const player2 = await prisma.user.create({
    data: {
      email: "jatekos2@damareen.hu",
      username: "MysticMage",
      password,
      role: "PLAYER",
      emailVerified: true,
      profileVisibility: true,
    },
  });

  const player3 = await prisma.user.create({
    data: {
      email: "jatekos3@damareen.hu",
      username: "ShadowHunter",
      password,
      role: "PLAYER",
      emailVerified: true,
      profileVisibility: false,
    },
  });

  const player4 = await prisma.user.create({
    data: {
      email: "jatekos4@damareen.hu",
      username: "StarCommander",
      password,
      role: "PLAYER",
      emailVerified: true,
      profileVisibility: true,
    },
  });

  const player5 = await prisma.user.create({
    data: {
      email: "jatekos5@damareen.hu",
      username: "KnightErrant",
      password,
      role: "PLAYER",
      emailVerified: false,
      profileVisibility: true,
    },
  });

  const player6 = await prisma.user.create({
    data: {
      email: "jatekos6@damareen.hu",
      username: "PhoenixRising",
      password,
      role: "PLAYER",
      emailVerified: true,
      profileVisibility: true,
    },
  });

  console.log(`✅ ${8} felhasználó létrehozva`);

  // ============================================
  // 2. JÁTÉKKÖRNYEZETEK LÉTREHOZÁSA
  // ============================================
  console.log("🌍 Játékkörnyezetek létrehozása...");

  const fantasyEnv = await prisma.environment.create({
    data: {
      name: "Középkori Fantasy",
      description: "Sárkányok, varázslók és hősök világa",
    },
  });

  const scifiEnv = await prisma.environment.create({
    data: {
      name: "Galaktikus Űrháború",
      description: "Jedi lovagok és űrhajók galaxisa",
    },
  });

  const medievalEnv = await prisma.environment.create({
    data: {
      name: "Artúr Király Birodalma",
      description: "Kerekasztal lovagjai és Camelot",
    },
  });

  const vikingEnv = await prisma.environment.create({
    data: {
      name: "Viking Saga",
      description: "Viking harcosok és északi mitológia",
    },
  });

  const cyberpunkEnv = await prisma.environment.create({
    data: {
      name: "Cyberpunk 2177",
      description: "Sötét jövő megakorporációkkal",
    },
  });

  console.log(`✅ ${5} környezet létrehozva`);

  // ============================================
  // 3. VILÁGKÁRTYÁK LÉTREHOZÁSA
  // ============================================
  console.log("🎴 Világkártyák létrehozása...");

  // KÖZÉPKORI FANTASY - 12 kártya (6 hős + 6 ellenség)
  const fantasyCards = [
    // HŐS KÁRTYÁK (erős, játékosoknak)
    { name: "Aragorn", damage: 14, health: 16, type: "FIRE", order: 1 },
    { name: "Gandalf", damage: 16, health: 14, type: "AIR", order: 2 },
    { name: "Legolas", damage: 15, health: 15, type: "EARTH", order: 3 },
    { name: "Gimli", damage: 13, health: 18, type: "EARTH", order: 4 },
    { name: "Galadriel", damage: 17, health: 13, type: "WATER", order: 5 },
    { name: "Elrond", damage: 16, health: 15, type: "AIR", order: 6 },
    
    // ELLENSÉG KÁRTYÁK (gyengébb, kazamatákhoz)
    { name: "Ork Harcos", damage: 5, health: 7, type: "FIRE", order: 7 },
    { name: "Goblin Tolvaj", damage: 4, health: 6, type: "EARTH", order: 8 },
    { name: "Nazgûl", damage: 9, health: 11, type: "WATER", order: 9 },
    { name: "Ork Nyilász", damage: 6, health: 8, type: "FIRE", order: 10 },
    { name: "Troll", damage: 8, health: 12, type: "EARTH", order: 11 },
    { name: "Fekete Varázsló", damage: 10, health: 10, type: "AIR", order: 12 },
  ];

  const createdFantasyCards = [];
  for (const card of fantasyCards) {
    const created = await prisma.worldCard.create({
      data: {
        ...card,
        environmentId: fantasyEnv.id,
      },
    });
    createdFantasyCards.push(created);
  }

  // GALAKTIKUS ŰRHÁBORÚ - 12 kártya (6 hős + 6 ellenség)
  const scifiCards = [
    // HŐS KÁRTYÁK
    { name: "Luke Skywalker", damage: 15, health: 14, type: "AIR", order: 1 },
    { name: "Han Solo", damage: 13, health: 16, type: "FIRE", order: 2 },
    { name: "Leia Organa", damage: 14, health: 15, type: "WATER", order: 3 },
    { name: "Chewbacca", damage: 16, health: 17, type: "EARTH", order: 4 },
    { name: "Yoda", damage: 18, health: 12, type: "AIR", order: 5 },
    { name: "Obi-Wan Kenobi", damage: 17, health: 14, type: "FIRE", order: 6 },
    
    // ELLENSÉG KÁRTYÁK
    { name: "Stormtrooper", damage: 5, health: 6, type: "FIRE", order: 7 },
    { name: "TIE Pilóta", damage: 6, health: 7, type: "AIR", order: 8 },
    { name: "Darth Vader", damage: 11, health: 13, type: "FIRE", order: 9 },
    { name: "Boba Fett", damage: 9, health: 10, type: "EARTH", order: 10 },
    { name: "Birodalom Tiszt", damage: 4, health: 5, type: "WATER", order: 11 },
    { name: "Sith Inkvizítor", damage: 10, health: 11, type: "AIR", order: 12 },
  ];

  const createdScifiCards = [];
  for (const card of scifiCards) {
    const created = await prisma.worldCard.create({
      data: {
        ...card,
        environmentId: scifiEnv.id,
      },
    });
    createdScifiCards.push(created);
  }

  // ARTÚR KIRÁLY BIRODALMA - 12 kártya (6 hős + 6 ellenség)
  const medievalCards = [
    // HŐS KÁRTYÁK
    { name: "Artúr Király", damage: 18, health: 16, type: "FIRE", order: 1 },
    { name: "Lancelot", damage: 16, health: 15, type: "FIRE", order: 2 },
    { name: "Merlin", damage: 19, health: 12, type: "AIR", order: 3 },
    { name: "Gawain Lovag", damage: 15, health: 17, type: "EARTH", order: 4 },
    { name: "Morgana", damage: 17, health: 13, type: "WATER", order: 5 },
    { name: "Percival", damage: 14, health: 16, type: "FIRE", order: 6 },
    
    // ELLENSÉG KÁRTYÁK
    { name: "Zsoldos", damage: 6, health: 8, type: "FIRE", order: 7 },
    { name: "Fekete Lovag", damage: 8, health: 9, type: "EARTH", order: 8 },
    { name: "Sárkány", damage: 11, health: 12, type: "FIRE", order: 9 },
    { name: "Bárgyú Rabló", damage: 5, health: 7, type: "EARTH", order: 10 },
    { name: "Gonosz Boszorkány", damage: 9, health: 10, type: "WATER", order: 11 },
    { name: "Árnyék Démon", damage: 10, health: 11, type: "AIR", order: 12 },
  ];

  const createdMedievalCards = [];
  for (const card of medievalCards) {
    const created = await prisma.worldCard.create({
      data: {
        ...card,
        environmentId: medievalEnv.id,
      },
    });
    createdMedievalCards.push(created);
  }

  // VIKING SAGA - 12 kártya (6 hős + 6 ellenség)
  const vikingCards = [
    // HŐS KÁRTYÁK
    { name: "Thor", damage: 20, health: 18, type: "FIRE", order: 1 },
    { name: "Ragnar Lothbrok", damage: 16, health: 16, type: "FIRE", order: 2 },
    { name: "Lagertha", damage: 15, health: 15, type: "EARTH", order: 3 },
    { name: "Bjorn Vasoldal", damage: 17, health: 17, type: "FIRE", order: 4 },
    { name: "Freya", damage: 18, health: 14, type: "AIR", order: 5 },
    { name: "Erik Vörös", damage: 14, health: 19, type: "WATER", order: 6 },
    
    // ELLENSÉG KÁRTYÁK
    { name: "Jégóriás", damage: 10, health: 13, type: "WATER", order: 7 },
    { name: "Frost Farkas", damage: 7, health: 9, type: "WATER", order: 8 },
    { name: "Draugr Harcos", damage: 8, health: 10, type: "EARTH", order: 9 },
    { name: "Troll Vadász", damage: 9, health: 11, type: "EARTH", order: 10 },
    { name: "Sötét Elf", damage: 6, health: 8, type: "AIR", order: 11 },
    { name: "Fenrir Kölyke", damage: 11, health: 12, type: "FIRE", order: 12 },
  ];

  const createdVikingCards = [];
  for (const card of vikingCards) {
    const created = await prisma.worldCard.create({
      data: {
        ...card,
        environmentId: vikingEnv.id,
      },
    });
    createdVikingCards.push(created);
  }

  // CYBERPUNK 2177 - 12 kártya (6 hős + 6 ellenség)
  const cyberpunkCards = [
    // HŐS KÁRTYÁK
    { name: "V", damage: 17, health: 15, type: "FIRE", order: 1 },
    { name: "Johnny Silverhand", damage: 16, health: 14, type: "AIR", order: 2 },
    { name: "Panam Palmer", damage: 15, health: 16, type: "EARTH", order: 3 },
    { name: "Judy Alvarez", damage: 14, health: 15, type: "WATER", order: 4 },
    { name: "Adam Smasher", damage: 19, health: 17, type: "FIRE", order: 5 },
    { name: "Alt Cunningham", damage: 18, health: 13, type: "AIR", order: 6 },
    
    // ELLENSÉG KÁRTYÁK
    { name: "Corpo Guard", damage: 6, health: 7, type: "FIRE", order: 7 },
    { name: "Netrunner", damage: 7, health: 8, type: "AIR", order: 8 },
    { name: "Cyber Psycho", damage: 10, health: 11, type: "FIRE", order: 9 },
    { name: "Drone Hunter", damage: 8, health: 9, type: "WATER", order: 10 },
    { name: "Maelstrom Thug", damage: 5, health: 6, type: "EARTH", order: 11 },
    { name: "AI Sentinel", damage: 11, health: 12, type: "AIR", order: 12 },
  ];

  const createdCyberpunkCards = [];
  for (const card of cyberpunkCards) {
    const created = await prisma.worldCard.create({
      data: {
        ...card,
        environmentId: cyberpunkEnv.id,
      },
    });
    createdCyberpunkCards.push(created);
  }

  console.log(`✅ ${fantasyCards.length + scifiCards.length + medievalCards.length + vikingCards.length + cyberpunkCards.length} világkártya létrehozva (5 környezet × 12 kártya)`);

  // ============================================
  // 4. VEZÉRKÁRTYÁK LÉTREHOZÁSA
  // ============================================
  console.log("👑 Vezérkártyák létrehozása...");

  // KÖZÉPKORI FANTASY VEZÉREK (6 vezér)
  const fantasyLeaders = [
    { name: "Nazgûl Király", baseCardId: createdFantasyCards[8].id, boostType: "DAMAGE_DOUBLE", environmentId: fantasyEnv.id },
    { name: "Ork Főnök Grommash", baseCardId: createdFantasyCards[6].id, boostType: "HEALTH_DOUBLE", environmentId: fantasyEnv.id },
    { name: "Goblin Vezér Grikk", baseCardId: createdFantasyCards[7].id, boostType: "DAMAGE_DOUBLE", environmentId: fantasyEnv.id },
    { name: "Troll Király Urok", baseCardId: createdFantasyCards[10].id, boostType: "DAMAGE_DOUBLE", environmentId: fantasyEnv.id },
    { name: "Saruman", baseCardId: createdFantasyCards[11].id, boostType: "HEALTH_DOUBLE", environmentId: fantasyEnv.id },
    { name: "Ork Warlord", baseCardId: createdFantasyCards[9].id, boostType: "HEALTH_DOUBLE", environmentId: fantasyEnv.id },
  ];

  // GALAKTIKUS ŰRHÁBORÚ VEZÉREK (6 vezér)
  const scifiLeaders = [
    { name: "Darth Vader Sith Úr", baseCardId: createdScifiCards[8].id, boostType: "DAMAGE_DOUBLE", environmentId: scifiEnv.id },
    { name: "Stormtrooper Kap.", baseCardId: createdScifiCards[6].id, boostType: "HEALTH_DOUBLE", environmentId: scifiEnv.id },
    { name: "Boba Fett Ász", baseCardId: createdScifiCards[9].id, boostType: "DAMAGE_DOUBLE", environmentId: scifiEnv.id },
    { name: "TIE Vadász Elite", baseCardId: createdScifiCards[7].id, boostType: "HEALTH_DOUBLE", environmentId: scifiEnv.id },
    { name: "Sith Lord Maul", baseCardId: createdScifiCards[11].id, boostType: "DAMAGE_DOUBLE", environmentId: scifiEnv.id },
    { name: "Admirális Tarkin", baseCardId: createdScifiCards[10].id, boostType: "HEALTH_DOUBLE", environmentId: scifiEnv.id },
  ];

  // ARTÚR KIRÁLY BIRODALMA VEZÉREK (6 vezér)
  const medievalLeaders = [
    { name: "Ősi Sárkány", baseCardId: createdMedievalCards[8].id, boostType: "DAMAGE_DOUBLE", environmentId: medievalEnv.id },
    { name: "Fekete Lovag Vezér", baseCardId: createdMedievalCards[7].id, boostType: "HEALTH_DOUBLE", environmentId: medievalEnv.id },
    { name: "Zsoldos Kapitány", baseCardId: createdMedievalCards[6].id, boostType: "DAMAGE_DOUBLE", environmentId: medievalEnv.id },
    { name: "Morgause", baseCardId: createdMedievalCards[10].id, boostType: "DAMAGE_DOUBLE", environmentId: medievalEnv.id },
    { name: "Sötét Varázsló", baseCardId: createdMedievalCards[11].id, boostType: "HEALTH_DOUBLE", environmentId: medievalEnv.id },
    { name: "Haramia Vezér", baseCardId: createdMedievalCards[9].id, boostType: "HEALTH_DOUBLE", environmentId: medievalEnv.id },
  ];

  // VIKING SAGA VEZÉREK (6 vezér)
  const vikingLeaders = [
    { name: "Jörmungandr", baseCardId: createdVikingCards[6].id, boostType: "DAMAGE_DOUBLE", environmentId: vikingEnv.id },
    { name: "Frost Óriás Király", baseCardId: createdVikingCards[7].id, boostType: "HEALTH_DOUBLE", environmentId: vikingEnv.id },
    { name: "Fenrir", baseCardId: createdVikingCards[11].id, boostType: "DAMAGE_DOUBLE", environmentId: vikingEnv.id },
    { name: "Draugr Overlord", baseCardId: createdVikingCards[8].id, boostType: "HEALTH_DOUBLE", environmentId: vikingEnv.id },
    { name: "Troll Jarl", baseCardId: createdVikingCards[9].id, boostType: "DAMAGE_DOUBLE", environmentId: vikingEnv.id },
    { name: "Sötét Elf Vezér", baseCardId: createdVikingCards[10].id, boostType: "HEALTH_DOUBLE", environmentId: vikingEnv.id },
  ];

  // CYBERPUNK 2177 VEZÉREK (6 vezér)
  const cyberpunkLeaders = [
    { name: "Cyber Psycho Alfa", baseCardId: createdCyberpunkCards[8].id, boostType: "DAMAGE_DOUBLE", environmentId: cyberpunkEnv.id },
    { name: "MaxTac Commander", baseCardId: createdCyberpunkCards[6].id, boostType: "HEALTH_DOUBLE", environmentId: cyberpunkEnv.id },
    { name: "AI Overlord", baseCardId: createdCyberpunkCards[11].id, boostType: "DAMAGE_DOUBLE", environmentId: cyberpunkEnv.id },
    { name: "Elite Netrunner", baseCardId: createdCyberpunkCards[7].id, boostType: "HEALTH_DOUBLE", environmentId: cyberpunkEnv.id },
    { name: "Drone Swarm Leader", baseCardId: createdCyberpunkCards[9].id, boostType: "DAMAGE_DOUBLE", environmentId: cyberpunkEnv.id },
    { name: "Maelstrom Boss", baseCardId: createdCyberpunkCards[10].id, boostType: "HEALTH_DOUBLE", environmentId: cyberpunkEnv.id },
  ];

  const allLeaders = [...fantasyLeaders, ...scifiLeaders, ...medievalLeaders, ...vikingLeaders, ...cyberpunkLeaders];
  const createdLeaderCards = [];
  
  for (const leader of allLeaders) {
    const created = await prisma.leaderCard.create({
      data: leader,
    });
    createdLeaderCards.push(created);
  }

  console.log(`✅ ${allLeaders.length} vezérkártya létrehozva (5 környezet × 6 vezér)`);

  // ============================================
  // 5. KAZAMATÁK LÉTREHOZÁSA
  // ============================================
  console.log("🏰 Kazamaták létrehozása...");

  // ===== KÖZÉPKORI FANTASY KAZAMATÁK =====
  
  // Egyszerű találkozás #1
  await prisma.dungeon.create({
    data: {
      name: "Goblin Őrjárat",
      type: "SIMPLE_ENCOUNTER",
      order: 1,
      requiredWins: 0,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[7].id }, // Goblin Tolvaj
        ],
      },
    },
  });

  // Kis kazamata #1
  await prisma.dungeon.create({
    data: {
      name: "A Goblin Barlang",
      type: "SMALL_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[7].id }, // Goblin
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[7].id }, // Goblin
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[2].id }, // Goblin Vezér Grikk
        ],
      },
    },
  });

  // Kis kazamata #2
  await prisma.dungeon.create({
    data: {
      name: "Ork Erőd Ostroma",
      type: "SMALL_DUNGEON",
      order: 3,
      requiredWins: 2,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[9].id }, // Ork Nyilász
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[1].id }, // Ork Főnök
        ],
      },
    },
  });

  // Nagy kazamata #1
  await prisma.dungeon.create({
    data: {
      name: "A Troll Hegy Rejtélye",
      type: "LARGE_DUNGEON",
      order: 4,
      requiredWins: 3,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[7].id }, // Goblin
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[9].id }, // Ork Nyilász
          { order: 3, isLeader: false, worldCardId: createdFantasyCards[10].id }, // Troll
          { order: 4, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[3].id }, // Troll Király
        ],
      },
    },
  });

  // Nagy kazamata #2
  await prisma.dungeon.create({
    data: {
      name: "A Nazgûl Árnyéka",
      type: "LARGE_DUNGEON",
      order: 5,
      requiredWins: 4,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[11].id }, // Fekete Varázsló
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[8].id }, // Nazgûl
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[10].id }, // Troll
          { order: 3, isLeader: false, worldCardId: createdFantasyCards[9].id }, // Ork Nyilász
          { order: 4, isLeader: false, worldCardId: createdFantasyCards[11].id }, // Fekete Varázsló
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[0].id }, // Nazgûl Király
        ],
      },
    },
  });

  // Nagy kazamata #3 - VÉGSŐ BOSS
  await prisma.dungeon.create({
    data: {
      name: "Saruman Tornya",
      type: "LARGE_DUNGEON",
      order: 6,
      requiredWins: 5,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[8].id }, // Nazgûl
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[10].id }, // Troll
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[11].id }, // Fekete Varázsló
          { order: 3, isLeader: false, worldCardId: createdFantasyCards[8].id }, // Nazgûl
          { order: 4, isLeader: false, worldCardId: createdFantasyCards[10].id }, // Troll
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[4].id }, // Saruman
        ],
      },
    },
  });

  // ===== GALAKTIKUS ŰRHÁBORÚ KAZAMATÁK =====
  
  await prisma.dungeon.create({
    data: {
      name: "Őrjárat a Tatooine-on",
      type: "SIMPLE_ENCOUNTER",
      order: 1,
      requiredWins: 0,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[10].id }, // Birodalom Tiszt
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Stormtrooper Század",
      type: "SMALL_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[6].id }, // Stormtrooper
          { order: 1, isLeader: false, worldCardId: createdScifiCards[6].id }, // Stormtrooper
          { order: 2, isLeader: false, worldCardId: createdScifiCards[10].id }, // Birodalom Tiszt
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[7].id }, // Stormtrooper Kapitány
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "TIE Vadász Rajok",
      type: "SMALL_DUNGEON",
      order: 3,
      requiredWins: 2,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[7].id }, // TIE Pilóta
          { order: 1, isLeader: false, worldCardId: createdScifiCards[6].id }, // Stormtrooper
          { order: 2, isLeader: false, worldCardId: createdScifiCards[7].id }, // TIE Pilóta
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[9].id }, // TIE Vadász Elite
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Boba Fett Vadászata",
      type: "LARGE_DUNGEON",
      order: 4,
      requiredWins: 3,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[6].id }, // Stormtrooper
          { order: 1, isLeader: false, worldCardId: createdScifiCards[7].id }, // TIE Pilóta
          { order: 2, isLeader: false, worldCardId: createdScifiCards[9].id }, // Boba Fett
          { order: 3, isLeader: false, worldCardId: createdScifiCards[6].id }, // Stormtrooper
          { order: 4, isLeader: false, worldCardId: createdScifiCards[7].id }, // TIE Pilóta
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[8].id }, // Boba Fett Ász
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Halálcsillag",
      type: "LARGE_DUNGEON",
      order: 5,
      requiredWins: 4,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[11].id }, // Sith Inkvizítor
          { order: 1, isLeader: false, worldCardId: createdScifiCards[7].id }, // TIE Pilóta
          { order: 2, isLeader: false, worldCardId: createdScifiCards[8].id }, // Darth Vader
          { order: 3, isLeader: false, worldCardId: createdScifiCards[9].id }, // Boba Fett
          { order: 4, isLeader: false, worldCardId: createdScifiCards[11].id }, // Sith Inkvizítor
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[6].id }, // Darth Vader Sith Úr
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Birodalom Végső Csapása",
      type: "LARGE_DUNGEON",
      order: 6,
      requiredWins: 5,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[8].id }, // Darth Vader
          { order: 1, isLeader: false, worldCardId: createdScifiCards[11].id }, // Sith Inkvizítor
          { order: 2, isLeader: false, worldCardId: createdScifiCards[9].id }, // Boba Fett
          { order: 3, isLeader: false, worldCardId: createdScifiCards[11].id }, // Sith Inkvizítor
          { order: 4, isLeader: false, worldCardId: createdScifiCards[8].id }, // Darth Vader
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[10].id }, // Sith Lord Maul
        ],
      },
    },
  });

  // ===== ARTÚR KIRÁLY BIRODALMA KAZAMATÁK =====
  
  await prisma.dungeon.create({
    data: {
      name: "Erdei Haramiák",
      type: "SIMPLE_ENCOUNTER",
      order: 1,
      requiredWins: 0,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[9].id }, // Rabló
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Zsoldos Tábor",
      type: "SMALL_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[6].id }, // Zsoldos
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[9].id }, // Rabló
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[6].id }, // Zsoldos
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[14].id }, // Zsoldos Kapitány
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Fekete Lovag Vára",
      type: "SMALL_DUNGEON",
      order: 3,
      requiredWins: 2,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[6].id }, // Zsoldos
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[7].id }, // Fekete Lovag
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[6].id }, // Zsoldos
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[13].id }, // Fekete Lovag Vezér
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Morgause Boszorkányai",
      type: "LARGE_DUNGEON",
      order: 4,
      requiredWins: 3,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[10].id }, // Boszorkány
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[7].id }, // Fekete Lovag
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[11].id }, // Árnyék Démon
          { order: 3, isLeader: false, worldCardId: createdMedievalCards[10].id }, // Boszorkány
          { order: 4, isLeader: false, worldCardId: createdMedievalCards[7].id }, // Fekete Lovag
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[15].id }, // Morgause
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Sárkány Barlangja",
      type: "LARGE_DUNGEON",
      order: 5,
      requiredWins: 4,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[7].id }, // Fekete Lovag
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[11].id }, // Árnyék Démon
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[8].id }, // Sárkány
          { order: 3, isLeader: false, worldCardId: createdMedievalCards[10].id }, // Boszorkány
          { order: 4, isLeader: false, worldCardId: createdMedievalCards[11].id }, // Árnyék Démon
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[12].id }, // Ősi Sárkány
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Az Árnyak Birodalma",
      type: "LARGE_DUNGEON",
      order: 6,
      requiredWins: 5,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[11].id }, // Árnyék Démon
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[8].id }, // Sárkány
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[10].id }, // Boszorkány
          { order: 3, isLeader: false, worldCardId: createdMedievalCards[11].id }, // Árnyék Démon
          { order: 4, isLeader: false, worldCardId: createdMedievalCards[8].id }, // Sárkány
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[16].id }, // Sötét Varázsló
        ],
      },
    },
  });

  // ===== VIKING SAGA KAZAMATÁK =====
  
  await prisma.dungeon.create({
    data: {
      name: "Első Frost",
      type: "SIMPLE_ENCOUNTER",
      order: 1,
      requiredWins: 0,
      environmentId: vikingEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdVikingCards[10].id }, // Sötét Elf
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Frost Farkas Falka",
      type: "SMALL_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: vikingEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdVikingCards[7].id }, // Frost Farkas
          { order: 1, isLeader: false, worldCardId: createdVikingCards[10].id }, // Sötét Elf
          { order: 2, isLeader: false, worldCardId: createdVikingCards[7].id }, // Frost Farkas
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[19].id }, // Frost Óriás Király
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Draugr Sírhalom",
      type: "SMALL_DUNGEON",
      order: 3,
      requiredWins: 2,
      environmentId: vikingEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdVikingCards[8].id }, // Draugr
          { order: 1, isLeader: false, worldCardId: createdVikingCards[10].id }, // Sötét Elf
          { order: 2, isLeader: false, worldCardId: createdVikingCards[8].id }, // Draugr
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[21].id }, // Draugr Overlord
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Jégóriás Vára",
      type: "LARGE_DUNGEON",
      order: 4,
      requiredWins: 3,
      environmentId: vikingEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdVikingCards[7].id }, // Frost Farkas
          { order: 1, isLeader: false, worldCardId: createdVikingCards[6].id }, // Jégóriás
          { order: 2, isLeader: false, worldCardId: createdVikingCards[8].id }, // Draugr
          { order: 3, isLeader: false, worldCardId: createdVikingCards[7].id }, // Frost Farkas
          { order: 4, isLeader: false, worldCardId: createdVikingCards[6].id }, // Jégóriás
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[18].id }, // Jörmungandr
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Troll Jarl Birodalma",
      type: "LARGE_DUNGEON",
      order: 5,
      requiredWins: 4,
      environmentId: vikingEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdVikingCards[9].id }, // Troll Vadász
          { order: 1, isLeader: false, worldCardId: createdVikingCards[8].id }, // Draugr
          { order: 2, isLeader: false, worldCardId: createdVikingCards[6].id }, // Jégóriás
          { order: 3, isLeader: false, worldCardId: createdVikingCards[9].id }, // Troll Vadász
          { order: 4, isLeader: false, worldCardId: createdVikingCards[8].id }, // Draugr
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[22].id }, // Troll Jarl
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Fenrir Ébredése",
      type: "LARGE_DUNGEON",
      order: 6,
      requiredWins: 5,
      environmentId: vikingEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdVikingCards[11].id }, // Fenrir Kölyke
          { order: 1, isLeader: false, worldCardId: createdVikingCards[6].id }, // Jégóriás
          { order: 2, isLeader: false, worldCardId: createdVikingCards[9].id }, // Troll Vadász
          { order: 3, isLeader: false, worldCardId: createdVikingCards[11].id }, // Fenrir Kölyke
          { order: 4, isLeader: false, worldCardId: createdVikingCards[6].id }, // Jégóriás
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[20].id }, // Fenrir
        ],
      },
    },
  });

  // ===== CYBERPUNK 2177 KAZAMATÁK =====
  
  await prisma.dungeon.create({
    data: {
      name: "Utcai Bandák",
      type: "SIMPLE_ENCOUNTER",
      order: 1,
      requiredWins: 0,
      environmentId: cyberpunkEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdCyberpunkCards[10].id }, // Maelstrom Thug
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Corpo Plaza Védelem",
      type: "SMALL_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: cyberpunkEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdCyberpunkCards[6].id }, // Corpo Guard
          { order: 1, isLeader: false, worldCardId: createdCyberpunkCards[10].id }, // Maelstrom
          { order: 2, isLeader: false, worldCardId: createdCyberpunkCards[6].id }, // Corpo Guard
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[25].id }, // MaxTac Commander
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Netrunner Támadás",
      type: "SMALL_DUNGEON",
      order: 3,
      requiredWins: 2,
      environmentId: cyberpunkEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdCyberpunkCards[7].id }, // Netrunner
          { order: 1, isLeader: false, worldCardId: createdCyberpunkCards[6].id }, // Corpo Guard
          { order: 2, isLeader: false, worldCardId: createdCyberpunkCards[7].id }, // Netrunner
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[27].id }, // Elite Netrunner
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Drone Swarm",
      type: "LARGE_DUNGEON",
      order: 4,
      requiredWins: 3,
      environmentId: cyberpunkEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdCyberpunkCards[9].id }, // Drone Hunter
          { order: 1, isLeader: false, worldCardId: createdCyberpunkCards[7].id }, // Netrunner
          { order: 2, isLeader: false, worldCardId: createdCyberpunkCards[6].id }, // Corpo Guard
          { order: 3, isLeader: false, worldCardId: createdCyberpunkCards[9].id }, // Drone Hunter
          { order: 4, isLeader: false, worldCardId: createdCyberpunkCards[7].id }, // Netrunner
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[28].id }, // Drone Swarm Leader
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Cyber Psycho Mészárlás",
      type: "LARGE_DUNGEON",
      order: 5,
      requiredWins: 4,
      environmentId: cyberpunkEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdCyberpunkCards[8].id }, // Cyber Psycho
          { order: 1, isLeader: false, worldCardId: createdCyberpunkCards[11].id }, // AI Sentinel
          { order: 2, isLeader: false, worldCardId: createdCyberpunkCards[9].id }, // Drone Hunter
          { order: 3, isLeader: false, worldCardId: createdCyberpunkCards[8].id }, // Cyber Psycho
          { order: 4, isLeader: false, worldCardId: createdCyberpunkCards[11].id }, // AI Sentinel
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[24].id }, // Cyber Psycho Alfa
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "AI Uprising",
      type: "LARGE_DUNGEON",
      order: 6,
      requiredWins: 5,
      environmentId: cyberpunkEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdCyberpunkCards[11].id }, // AI Sentinel
          { order: 1, isLeader: false, worldCardId: createdCyberpunkCards[8].id }, // Cyber Psycho
          { order: 2, isLeader: false, worldCardId: createdCyberpunkCards[9].id }, // Drone Hunter
          { order: 3, isLeader: false, worldCardId: createdCyberpunkCards[11].id }, // AI Sentinel
          { order: 4, isLeader: false, worldCardId: createdCyberpunkCards[8].id }, // Cyber Psycho
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[26].id }, // AI Overlord
        ],
      },
    },
  });

  console.log(`✅ ${30} kazamata létrehozva (5 környezet × 6 kazamata)`);

  // ============================================
  // 6. HŐS VEZÉRKÁRTYÁK LÉTREHOZÁSA (JÁTÉKOSOKNAK)
  // ============================================
  console.log("⚔️ Hős vezérkártyák létrehozása a játékosok gyűjteményéhez...");

  // KÖZÉPKORI FANTASY HŐS VEZÉREK (játékosok gyűjteményéhez)
  const fantasyHeroLeaders = [];
  for (let i = 0; i < 6; i++) {
    const leader = await prisma.leaderCard.create({
      data: {
        name: `${createdFantasyCards[i].name} Hős`,
        baseCardId: createdFantasyCards[i].id,
        boostType: i % 2 === 0 ? "DAMAGE_DOUBLE" : "HEALTH_DOUBLE",
        environmentId: fantasyEnv.id,
      },
    });
    fantasyHeroLeaders.push(leader);
  }

  // GALAKTIKUS ŰRHÁBORÚ HŐS VEZÉREK
  const scifiHeroLeaders = [];
  for (let i = 0; i < 6; i++) {
    const leader = await prisma.leaderCard.create({
      data: {
        name: `${createdScifiCards[i].name} Hős`,
        baseCardId: createdScifiCards[i].id,
        boostType: i % 2 === 0 ? "DAMAGE_DOUBLE" : "HEALTH_DOUBLE",
        environmentId: scifiEnv.id,
      },
    });
    scifiHeroLeaders.push(leader);
  }

  // ARTÚR KIRÁLY BIRODALMA HŐS VEZÉREK
  const medievalHeroLeaders = [];
  for (let i = 0; i < 6; i++) {
    const leader = await prisma.leaderCard.create({
      data: {
        name: `${createdMedievalCards[i].name} Hős`,
        baseCardId: createdMedievalCards[i].id,
        boostType: i % 2 === 0 ? "DAMAGE_DOUBLE" : "HEALTH_DOUBLE",
        environmentId: medievalEnv.id,
      },
    });
    medievalHeroLeaders.push(leader);
  }

  // VIKING SAGA HŐS VEZÉREK
  const vikingHeroLeaders = [];
  for (let i = 0; i < 6; i++) {
    const leader = await prisma.leaderCard.create({
      data: {
        name: `${createdVikingCards[i].name} Hős`,
        baseCardId: createdVikingCards[i].id,
        boostType: i % 2 === 0 ? "DAMAGE_DOUBLE" : "HEALTH_DOUBLE",
        environmentId: vikingEnv.id,
      },
    });
    vikingHeroLeaders.push(leader);
  }

  // CYBERPUNK 2177 HŐS VEZÉREK
  const cyberpunkHeroLeaders = [];
  for (let i = 0; i < 6; i++) {
    const leader = await prisma.leaderCard.create({
      data: {
        name: `${createdCyberpunkCards[i].name} Hős`,
        baseCardId: createdCyberpunkCards[i].id,
        boostType: i % 2 === 0 ? "DAMAGE_DOUBLE" : "HEALTH_DOUBLE",
        environmentId: cyberpunkEnv.id,
      },
    });
    cyberpunkHeroLeaders.push(leader);
  }

  console.log(`✅ ${30} hős vezérkártya létrehozva játékosok gyűjteményéhez (5 környezet × 6 hős)`);

  // ============================================
  // 7. JÁTÉKOK, GYŰJTEMÉNYEK, PAKLIK ÉS HARCOK
  // ============================================
  console.log("🎮 Játékok, gyűjtemények, paklik és harcok létrehozása...");

  // ===== JÁTÉKOS 1 - DragonSlayer (Fantasy) =====
  console.log("   📖 Játékos 1 - DragonSlayer kalandja...");
  
  const game1 = await prisma.game.create({
    data: {
      name: "Középfölde Legendái",
      userId: player1.id,
      environmentId: fantasyEnv.id,
    },
  });

  // Gyűjtemény - 4 hős vezér fejlesztve
  const game1Card1 = await prisma.playerCard.create({
    data: {
      gameId: game1.id,
      baseCardId: fantasyHeroLeaders[0].id, // Aragorn Hős
      damageBoost: 8,
      healthBoost: 5,
    },
  });

  const game1Card2 = await prisma.playerCard.create({
    data: {
      gameId: game1.id,
      baseCardId: fantasyHeroLeaders[1].id, // Gandalf Hős
      damageBoost: 6,
      healthBoost: 7,
    },
  });

  const game1Card3 = await prisma.playerCard.create({
    data: {
      gameId: game1.id,
      baseCardId: fantasyHeroLeaders[2].id, // Legolas Hős
      damageBoost: 7,
      healthBoost: 6,
    },
  });

  const game1Card4 = await prisma.playerCard.create({
    data: {
      gameId: game1.id,
      baseCardId: fantasyHeroLeaders[3].id, // Gimli Hős
      damageBoost: 5,
      healthBoost: 9,
    },
  });

  // Pakli összeállítása (1 egyszerű kazamatához)
  const game1Deck1 = await prisma.deck.create({
    data: {
      gameId: game1.id,
      name: "Kezdő Pakli",
      isActive: false,
      deckCards: {
        create: [
          { order: 0, playerCardId: game1Card1.id },
        ],
      },
    },
  });

  // Pakli 2 (3+1 kis kazamatához - 4 lap)
  const game1Deck2 = await prisma.deck.create({
    data: {
      gameId: game1.id,
      name: "Goblin Vadász Pakli",
      isActive: true,
      deckCards: {
        create: [
          { order: 0, playerCardId: game1Card1.id },
          { order: 1, playerCardId: game1Card2.id },
          { order: 2, playerCardId: game1Card3.id },
          { order: 3, playerCardId: game1Card4.id },
        ],
      },
    },
  });

  console.log(`   ✅ Játékos 1: 1 játék, 4 kártya, 2 pakli létrehozva`);

  // ===== JÁTÉKOS 2 - MysticMage (Sci-Fi) =====
  console.log("   📖 Játékos 2 - MysticMage kalandja...");
  
  const game2 = await prisma.game.create({
    data: {
      name: "Galaxis Védelmezői",
      userId: player2.id,
      environmentId: scifiEnv.id,
    },
  });

  const game2Card1 = await prisma.playerCard.create({
    data: {
      gameId: game2.id,
      baseCardId: scifiHeroLeaders[0].id, // Luke Skywalker Hős
      damageBoost: 10,
      healthBoost: 8,
    },
  });

  const game2Card2 = await prisma.playerCard.create({
    data: {
      gameId: game2.id,
      baseCardId: scifiHeroLeaders[1].id, // Han Solo Hős
      damageBoost: 7,
      healthBoost: 9,
    },
  });

  const game2Card3 = await prisma.playerCard.create({
    data: {
      gameId: game2.id,
      baseCardId: scifiHeroLeaders[2].id, // Leia Organa Hős
      damageBoost: 8,
      healthBoost: 8,
    },
  });

  const game2Card4 = await prisma.playerCard.create({
    data: {
      gameId: game2.id,
      baseCardId: scifiHeroLeaders[3].id, // Chewbacca Hős
      damageBoost: 9,
      healthBoost: 10,
    },
  });

  const game2Deck = await prisma.deck.create({
    data: {
      gameId: game2.id,
      name: "Lázadó Harcosok",
      isActive: true,
      deckCards: {
        create: [
          { order: 0, playerCardId: game2Card1.id },
          { order: 1, playerCardId: game2Card2.id },
          { order: 2, playerCardId: game2Card3.id },
          { order: 3, playerCardId: game2Card4.id },
        ],
      },
    },
  });

  console.log(`   ✅ Játékos 2: 1 játék, 4 kártya, 1 pakli létrehozva`);

  // ===== JÁTÉKOS 3 - ShadowHunter (Medieval) =====
  console.log("   📖 Játékos 3 - ShadowHunter kalandja...");
  
  const game3 = await prisma.game.create({
    data: {
      name: "Camelot Védelmezése",
      userId: player3.id,
      environmentId: medievalEnv.id,
    },
  });

  const game3Card1 = await prisma.playerCard.create({
    data: {
      gameId: game3.id,
      baseCardId: medievalHeroLeaders[0].id, // Artúr Király Hős
      damageBoost: 12,
      healthBoost: 10,
    },
  });

  const game3Card2 = await prisma.playerCard.create({
    data: {
      gameId: game3.id,
      baseCardId: medievalHeroLeaders[1].id, // Lancelot Hős
      damageBoost: 10,
      healthBoost: 9,
    },
  });

  const game3Card3 = await prisma.playerCard.create({
    data: {
      gameId: game3.id,
      baseCardId: medievalHeroLeaders[2].id, // Merlin Hős
      damageBoost: 11,
      healthBoost: 8,
    },
  });

  const game3Card4 = await prisma.playerCard.create({
    data: {
      gameId: game3.id,
      baseCardId: medievalHeroLeaders[3].id, // Gawain Lovag Hős
      damageBoost: 9,
      healthBoost: 11,
    },
  });

  const game3Card5 = await prisma.playerCard.create({
    data: {
      gameId: game3.id,
      baseCardId: medievalHeroLeaders[4].id, // Morgana Hős
      damageBoost: 10,
      healthBoost: 10,
    },
  });

  const game3Card6 = await prisma.playerCard.create({
    data: {
      gameId: game3.id,
      baseCardId: medievalHeroLeaders[5].id, // Percival Hős
      damageBoost: 8,
      healthBoost: 12,
    },
  });

  // Nagy kazamatához pakli (6 lap)
  const game3Deck = await prisma.deck.create({
    data: {
      gameId: game3.id,
      name: "Kerekasztal Lovagjai",
      isActive: true,
      deckCards: {
        create: [
          { order: 0, playerCardId: game3Card1.id },
          { order: 1, playerCardId: game3Card2.id },
          { order: 2, playerCardId: game3Card3.id },
          { order: 3, playerCardId: game3Card4.id },
          { order: 4, playerCardId: game3Card5.id },
          { order: 5, playerCardId: game3Card6.id },
        ],
      },
    },
  });

  console.log(`   ✅ Játékos 3: 1 játék, 6 kártya, 1 pakli létrehozva`);

  // ===== JÁTÉKOS 4 - StarCommander (Cyberpunk) =====
  console.log("   📖 Játékos 4 - StarCommander kalandja...");
  
  const game4 = await prisma.game.create({
    data: {
      name: "Night City Túlélők",
      userId: player4.id,
      environmentId: cyberpunkEnv.id,
    },
  });

  const game4Card1 = await prisma.playerCard.create({
    data: {
      gameId: game4.id,
      baseCardId: cyberpunkHeroLeaders[0].id, // V Hős
      damageBoost: 11,
      healthBoost: 9,
    },
  });

  const game4Card2 = await prisma.playerCard.create({
    data: {
      gameId: game4.id,
      baseCardId: cyberpunkHeroLeaders[1].id, // Johnny Silverhand Hős
      damageBoost: 10,
      healthBoost: 8,
    },
  });

  const game4Card3 = await prisma.playerCard.create({
    data: {
      gameId: game4.id,
      baseCardId: cyberpunkHeroLeaders[2].id, // Panam Palmer Hős
      damageBoost: 9,
      healthBoost: 10,
    },
  });

  const game4Card4 = await prisma.playerCard.create({
    data: {
      gameId: game4.id,
      baseCardId: cyberpunkHeroLeaders[3].id, // Judy Alvarez Hős
      damageBoost: 8,
      healthBoost: 9,
    },
  });

  const game4Deck = await prisma.deck.create({
    data: {
      gameId: game4.id,
      name: "Netrunner Elit",
      isActive: true,
      deckCards: {
        create: [
          { order: 0, playerCardId: game4Card1.id },
          { order: 1, playerCardId: game4Card2.id },
          { order: 2, playerCardId: game4Card3.id },
          { order: 3, playerCardId: game4Card4.id },
        ],
      },
    },
  });

  console.log(`   ✅ Játékos 4: 1 játék, 4 kártya, 1 pakli létrehozva`);

  // ===== JÁTÉKOS 5 - KnightErrant (Viking) =====
  console.log("   📖 Játékos 5 - KnightErrant kalandja...");
  
  const game5 = await prisma.game.create({
    data: {
      name: "Valhalla Útja",
      userId: player5.id,
      environmentId: vikingEnv.id,
    },
  });

  const game5Card1 = await prisma.playerCard.create({
    data: {
      gameId: game5.id,
      baseCardId: vikingHeroLeaders[0].id, // Thor Hős
      damageBoost: 15,
      healthBoost: 12,
    },
  });

  const game5Card2 = await prisma.playerCard.create({
    data: {
      gameId: game5.id,
      baseCardId: vikingHeroLeaders[1].id, // Ragnar Lothbrok Hős
      damageBoost: 12,
      healthBoost: 11,
    },
  });

  const game5Card3 = await prisma.playerCard.create({
    data: {
      gameId: game5.id,
      baseCardId: vikingHeroLeaders[2].id, // Lagertha Hős
      damageBoost: 11,
      healthBoost: 10,
    },
  });

  const game5Deck = await prisma.deck.create({
    data: {
      gameId: game5.id,
      name: "Viking Harcosok",
      isActive: false,
      deckCards: {
        create: [
          { order: 0, playerCardId: game5Card1.id },
        ],
      },
    },
  });

  console.log(`   ✅ Játékos 5: 1 játék, 3 kártya, 1 pakli létrehozva`);

  // ===== JÁTÉKOS 6 - PhoenixRising (Fantasy + Sci-Fi) =====
  console.log("   📖 Játékos 6 - PhoenixRising kalandja...");
  
  // Első játék - Fantasy
  const game6a = await prisma.game.create({
    data: {
      name: "A Gyűrű Útja",
      userId: player6.id,
      environmentId: fantasyEnv.id,
    },
  });

  const game6aCard1 = await prisma.playerCard.create({
    data: {
      gameId: game6a.id,
      baseCardId: fantasyHeroLeaders[4].id, // Galadriel Hős
      damageBoost: 13,
      healthBoost: 9,
    },
  });

  const game6aCard2 = await prisma.playerCard.create({
    data: {
      gameId: game6a.id,
      baseCardId: fantasyHeroLeaders[5].id, // Elrond Hős
      damageBoost: 12,
      healthBoost: 10,
    },
  });

  // Második játék - Sci-Fi
  const game6b = await prisma.game.create({
    data: {
      name: "Erő Felébredése",
      userId: player6.id,
      environmentId: scifiEnv.id,
    },
  });

  const game6bCard1 = await prisma.playerCard.create({
    data: {
      gameId: game6b.id,
      baseCardId: scifiHeroLeaders[4].id, // Yoda Hős
      damageBoost: 14,
      healthBoost: 8,
    },
  });

  const game6bCard2 = await prisma.playerCard.create({
    data: {
      gameId: game6b.id,
      baseCardId: scifiHeroLeaders[5].id, // Obi-Wan Kenobi Hős
      damageBoost: 13,
      healthBoost: 9,
    },
  });

  console.log(`   ✅ Játékos 6: 2 játék, 4 kártya összesen létrehozva`);

  console.log(`✅ Összesen ${8} játék, több tucat kártya és pakli létrehozva`);

  // ============================================
  // 8. JÁTÉK STATISZTIKÁK LÉTREHOZÁSA
  // ============================================
  console.log("📊 Játékos statisztikák inicializálása...");

  await prisma.playerStats.create({
    data: {
      userId: player1.id,
      totalGamesPlayed: 1,
      totalBattlesPlayed: 5,
      totalBattlesWon: 3,
      totalBattlesLost: 2,
      totalDungeonsCompleted: 2,
      simpleDungeonsCompleted: 1,
      smallDungeonsCompleted: 1,
      totalClashes: 15,
      totalClashesWon: 9,
      totalClashesLost: 6,
      clashesWonByDamage: 7,
      clashesWonByType: 2,
      totalDamageDealt: 180,
      totalDamageTaken: 95,
      highestDamageInClash: 28,
      fireCardWins: 5,
      earthCardWins: 2,
      airCardWins: 2,
      totalCardsCollected: 4,
      totalCardUpgrades: 8,
      totalDamageUpgrades: 4,
      totalHealthUpgrades: 4,
      currentWinStreak: 2,
      longestWinStreak: 2,
      totalDecksCreated: 2,
    },
  });

  await prisma.playerStats.create({
    data: {
      userId: player2.id,
      totalGamesPlayed: 1,
      totalBattlesPlayed: 8,
      totalBattlesWon: 6,
      totalBattlesLost: 2,
      totalDungeonsCompleted: 4,
      simpleDungeonsCompleted: 1,
      smallDungeonsCompleted: 2,
      largeDungeonsCompleted: 1,
      totalClashes: 32,
      totalClashesWon: 22,
      totalClashesLost: 10,
      clashesWonByDamage: 18,
      clashesWonByType: 4,
      totalDamageDealt: 420,
      totalDamageTaken: 180,
      highestDamageInClash: 35,
      fireCardWins: 8,
      waterCardWins: 7,
      airCardWins: 7,
      totalCardsCollected: 4,
      totalCardUpgrades: 14,
      totalDamageUpgrades: 7,
      totalHealthUpgrades: 7,
      currentWinStreak: 4,
      longestWinStreak: 4,
      totalDecksCreated: 1,
    },
  });

  await prisma.playerStats.create({
    data: {
      userId: player3.id,
      totalGamesPlayed: 1,
      totalBattlesPlayed: 12,
      totalBattlesWon: 9,
      totalBattlesLost: 3,
      totalDungeonsCompleted: 6,
      simpleDungeonsCompleted: 1,
      smallDungeonsCompleted: 2,
      largeDungeonsCompleted: 3,
      totalClashes: 56,
      totalClashesWon: 38,
      totalClashesLost: 18,
      clashesWonByDamage: 30,
      clashesWonByType: 8,
      totalDamageDealt: 680,
      totalDamageTaken: 320,
      highestDamageInClash: 42,
      fireCardWins: 15,
      earthCardWins: 10,
      airCardWins: 13,
      totalCardsCollected: 6,
      totalCardUpgrades: 26,
      totalDamageUpgrades: 13,
      totalHealthUpgrades: 13,
      currentWinStreak: 3,
      longestWinStreak: 5,
      totalDecksCreated: 1,
    },
  });

  await prisma.playerStats.create({
    data: {
      userId: player4.id,
      totalGamesPlayed: 1,
      totalBattlesPlayed: 6,
      totalBattlesWon: 4,
      totalBattlesLost: 2,
      totalDungeonsCompleted: 3,
      simpleDungeonsCompleted: 1,
      smallDungeonsCompleted: 1,
      largeDungeonsCompleted: 1,
      totalClashes: 24,
      totalClashesWon: 16,
      totalClashesLost: 8,
      clashesWonByDamage: 13,
      clashesWonByType: 3,
      totalDamageDealt: 340,
      totalDamageTaken: 150,
      highestDamageInClash: 38,
      fireCardWins: 7,
      waterCardWins: 4,
      airCardWins: 5,
      totalCardsCollected: 4,
      totalCardUpgrades: 16,
      totalDamageUpgrades: 8,
      totalHealthUpgrades: 8,
      currentWinStreak: 2,
      longestWinStreak: 3,
      totalDecksCreated: 1,
    },
  });

  await prisma.playerStats.create({
    data: {
      userId: player5.id,
      totalGamesPlayed: 1,
      totalBattlesPlayed: 2,
      totalBattlesWon: 1,
      totalBattlesLost: 1,
      totalDungeonsCompleted: 1,
      simpleDungeonsCompleted: 1,
      totalClashes: 4,
      totalClashesWon: 2,
      totalClashesLost: 2,
      clashesWonByDamage: 2,
      totalDamageDealt: 95,
      totalDamageTaken: 45,
      highestDamageInClash: 35,
      fireCardWins: 1,
      earthCardWins: 1,
      totalCardsCollected: 3,
      totalCardUpgrades: 11,
      totalDamageUpgrades: 5,
      totalHealthUpgrades: 6,
      currentWinStreak: 0,
      longestWinStreak: 1,
      totalDecksCreated: 1,
    },
  });

  await prisma.playerStats.create({
    data: {
      userId: player6.id,
      totalGamesPlayed: 2,
      totalBattlesPlayed: 10,
      totalBattlesWon: 7,
      totalBattlesLost: 3,
      totalDungeonsCompleted: 5,
      simpleDungeonsCompleted: 2,
      smallDungeonsCompleted: 2,
      largeDungeonsCompleted: 1,
      totalClashes: 38,
      totalClashesWon: 26,
      totalClashesLost: 12,
      clashesWonByDamage: 21,
      clashesWonByType: 5,
      totalDamageDealt: 520,
      totalDamageTaken: 210,
      highestDamageInClash: 40,
      fireCardWins: 8,
      waterCardWins: 9,
      airCardWins: 9,
      totalCardsCollected: 4,
      totalCardUpgrades: 20,
      totalDamageUpgrades: 10,
      totalHealthUpgrades: 10,
      currentWinStreak: 3,
      longestWinStreak: 4,
      totalDecksCreated: 2,
    },
  });

  console.log(`✅ ${6} játékos statisztikája inicializálva`);

  console.log(`✅ Összesen ${8} játék, több tucat kártya és pakli létrehozva`);

  // ============================================
  // ÖSSZEFOGLALÓ
  // ============================================
  console.log("\n🎉 Adatbázis sikeresen feltöltve!");
  console.log("=====================================");
  console.log(`👥 Felhasználók: 8`);
  console.log(`   - 2 webmester (admin, webmaster)`);
  console.log(`   - 6 játékos`);
  console.log(`   - Jelszó MINDENKINEK: 123456789`);
  console.log(``);
  console.log(`📧 Belépési adatok:`);
  console.log(`   Admin:          admin@damareen.hu / 123456789`);
  console.log(`   Webmester:      webmaster@damareen.hu / 123456789`);
  console.log(`   Játékos 1:      jatekos1@damareen.hu / 123456789 (DragonSlayer)`);
  console.log(`   Játékos 2:      jatekos2@damareen.hu / 123456789 (MysticMage)`);
  console.log(`   Játékos 3:      jatekos3@damareen.hu / 123456789 (ShadowHunter)`);
  console.log(`   Játékos 4:      jatekos4@damareen.hu / 123456789 (StarCommander)`);
  console.log(`   Játékos 5:      jatekos5@damareen.hu / 123456789 (KnightErrant)`);
  console.log(`   Játékos 6:      jatekos6@damareen.hu / 123456789 (PhoenixRising)`);
  console.log(``);
  console.log(`🌍 Környezetek: 5`);
  console.log(`   - Középkori Fantasy`);
  console.log(`   - Galaktikus Űrháború`);
  console.log(`   - Artúr Király Birodalma`);
  console.log(`   - Viking Saga`);
  console.log(`   - Cyberpunk 2177`);
  console.log(``);
  console.log(`🎴 Világkártyák: 60 (5 környezet × 12 kártya)`);
  console.log(`   - Minden környezetben: 6 hős + 6 ellenség`);
  console.log(``);
  console.log(`👑 Vezérkártyák: 60`);
  console.log(`   - 30 ELLENSÉG vezér (kazamatákhoz)`);
  console.log(`   - 30 HŐS vezér (játékosok gyűjteményéhez)`);
  console.log(``);
  console.log(`🏰 Kazamaták: 30 (5 környezet × 6 kazamata)`);
  console.log(`   - Minden környezetben:`);
  console.log(`     • 1 egyszerű találkozás (1 lap)`);
  console.log(`     • 2 kis kazamata (3+1 vezér)`);
  console.log(`     • 3 nagy kazamata (5+1 vezér)`);
  console.log(``);
  console.log(`🎮 Játékok: 8`);
  console.log(`   - Játékos 1: 1 játék (Fantasy) - 4 kártya, 2 pakli`);
  console.log(`   - Játékos 2: 1 játék (Sci-Fi) - 4 kártya, 1 pakli`);
  console.log(`   - Játékos 3: 1 játék (Medieval) - 6 kártya, 1 pakli`);
  console.log(`   - Játékos 4: 1 játék (Cyberpunk) - 4 kártya, 1 pakli`);
  console.log(`   - Játékos 5: 1 játék (Viking) - 3 kártya, 1 pakli`);
  console.log(`   - Játékos 6: 2 játék (Fantasy + Sci-Fi) - 4 kártya`);
  console.log(``);
  console.log(`📊 A játék azonnal játszható!`);
  console.log(`   - Több mint 20 kártya a gyűjteményekben`);
  console.log(`   - Összeállított paklik különböző kazamatákhoz`);
  console.log(`   - 5 teljesen különböző fantasy világ`);
  console.log(`   - Progresszív nehézségi szintek`);
  console.log("=====================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Hiba történt a seed során:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
