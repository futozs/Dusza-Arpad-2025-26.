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
  await prisma.user.deleteMany({});

  // Hash jelszó (1234)
  const password = await bcrypt.hash("1234", 10);

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
      twoFactorEnabled: true,
    },
  });

  const player1 = await prisma.user.create({
    data: {
      email: "jatekos1@damareen.hu",
      username: "Hős Péter",
      password,
      role: "PLAYER",
      emailVerified: true,
    },
  });

  const player2 = await prisma.user.create({
    data: {
      email: "jatekos2@damareen.hu",
      username: "Harcos Anna",
      password,
      role: "PLAYER",
      emailVerified: true,
    },
  });

  const player3 = await prisma.user.create({
    data: {
      email: "jatekos3@damareen.hu",
      username: "Varázsló Béla",
      password,
      role: "PLAYER",
      emailVerified: false,
    },
  });

  console.log(`✅ ${5} felhasználó létrehozva`);

  // ============================================
  // 2. JÁTÉKKÖRNYEZETEK LÉTREHOZÁSA
  // ============================================
  console.log("🌍 Játékkörnyezetek létrehozása...");

  const fantasyEnv = await prisma.environment.create({
    data: {
      name: "Fantasy Világ",
      description: "Középkori fantasy univerzum sárkányokkal és mágiával",
    },
  });

  const scifiEnv = await prisma.environment.create({
    data: {
      name: "Sci-Fi Galaxis",
      description: "Űrhajók és futurisztikus technológia világa",
    },
  });

  const medievalEnv = await prisma.environment.create({
    data: {
      name: "Középkori Birodalom",
      description: "Lovagok és várak korszaka",
    },
  });

  console.log(`✅ ${3} környezet létrehozva`);

  // ============================================
  // 3. VILÁGKÁRTYÁK LÉTREHOZÁSA
  // ============================================
  console.log("🎴 Világkártyák létrehozása...");

  // FANTASY VILÁG - 6 kártya (3 erős + 3 gyenge)
  const fantasyCards = [
    // Erős játékos kártyák (ezek kerülnek a játékos gyűjteményébe)
    { name: "Aragorn", damage: 12, health: 15, type: "FIRE", order: 1 },
    { name: "Gandalf", damage: 15, health: 12, type: "AIR", order: 2 },
    { name: "Legolas", damage: 13, health: 14, type: "EARTH", order: 3 },
    // Gyengébb ellenség kártyák (ezek kerülnek a kazamatákba)
    { name: "Ork Harcos", damage: 4, health: 6, type: "FIRE", order: 4 },
    { name: "Goblin", damage: 3, health: 5, type: "EARTH", order: 5 },
    { name: "Nazgûl", damage: 8, health: 10, type: "WATER", order: 6 },
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

  // SCI-FI GALAXIS - 6 kártya (3 erős + 3 gyenge)
  const scifiCards = [
    // Erős játékos kártyák
    { name: "Luke Skywalker", damage: 14, health: 13, type: "AIR", order: 1 },
    { name: "Han Solo", damage: 12, health: 14, type: "FIRE", order: 2 },
    { name: "Leia Organa", damage: 13, health: 12, type: "WATER", order: 3 },
    // Gyengébb ellenség kártyák
    { name: "Stormtrooper", damage: 4, health: 5, type: "FIRE", order: 4 },
    { name: "TIE Pilóta", damage: 5, health: 6, type: "AIR", order: 5 },
    { name: "Darth Vader", damage: 10, health: 12, type: "FIRE", order: 6 },
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

  // KÖZÉPKORI BIRODALOM - 6 kártya (3 erős + 3 gyenge)
  const medievalCards = [
    // Erős játékos kártyák
    { name: "Artúr Király", damage: 16, health: 15, type: "FIRE", order: 1 },
    { name: "Lancelot", damage: 15, health: 14, type: "FIRE", order: 2 },
    { name: "Merlin", damage: 17, health: 11, type: "AIR", order: 3 },
    // Gyengébb ellenség kártyák
    { name: "Zsoldos", damage: 5, health: 7, type: "FIRE", order: 4 },
    { name: "Fekete Lovag", damage: 7, health: 8, type: "EARTH", order: 5 },
    { name: "Sárkány", damage: 10, health: 11, type: "FIRE", order: 6 },
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

  console.log(`✅ ${fantasyCards.length + scifiCards.length + medievalCards.length} világkártya létrehozva (3 környezet × 6 kártya)`);

  // ============================================
  // 4. VEZÉRKÁRTYÁK LÉTREHOZÁSA
  // ============================================
  console.log("👑 Vezérkártyák létrehozása...");

  // Vezérkártyák a gyenge ellenség kártyákból (így legyőzhetőek!)
  const leaderCards = [
    // Fantasy vezérek
    {
      name: "Nazgûl Vezér",
      baseCardId: createdFantasyCards[5].id, // Nazgûl (8 dmg, 10 hp)
      boostType: "DAMAGE_DOUBLE", // 16 dmg, 10 hp
      environmentId: fantasyEnv.id,
    },
    {
      name: "Ork Főnök",
      baseCardId: createdFantasyCards[3].id, // Ork (4 dmg, 6 hp)
      boostType: "HEALTH_DOUBLE", // 4 dmg, 12 hp
      environmentId: fantasyEnv.id,
    },
    {
      name: "Goblin Király",
      baseCardId: createdFantasyCards[4].id, // Goblin (3 dmg, 5 hp)
      boostType: "DAMAGE_DOUBLE", // 6 dmg, 5 hp
      environmentId: fantasyEnv.id,
    },
    // Sci-Fi vezérek
    {
      name: "Darth Vader, Sith Úr",
      baseCardId: createdScifiCards[5].id, // Darth Vader (10 dmg, 12 hp)
      boostType: "DAMAGE_DOUBLE", // 20 dmg, 12 hp
      environmentId: scifiEnv.id,
    },
    {
      name: "Stormtrooper Parancsnok",
      baseCardId: createdScifiCards[3].id, // Stormtrooper (4 dmg, 5 hp)
      boostType: "HEALTH_DOUBLE", // 4 dmg, 10 hp
      environmentId: scifiEnv.id,
    },
    {
      name: "TIE Vadász Ász",
      baseCardId: createdScifiCards[4].id, // TIE Pilóta (5 dmg, 6 hp)
      boostType: "DAMAGE_DOUBLE", // 10 dmg, 6 hp
      environmentId: scifiEnv.id,
    },
    // Középkori vezérek
    {
      name: "Sárkány Úr",
      baseCardId: createdMedievalCards[5].id, // Sárkány (10 dmg, 11 hp)
      boostType: "DAMAGE_DOUBLE", // 20 dmg, 11 hp
      environmentId: medievalEnv.id,
    },
    {
      name: "Fekete Lovag Vezér",
      baseCardId: createdMedievalCards[4].id, // Fekete Lovag (7 dmg, 8 hp)
      boostType: "HEALTH_DOUBLE", // 7 dmg, 16 hp
      environmentId: medievalEnv.id,
    },
    {
      name: "Zsoldos Kapitány",
      baseCardId: createdMedievalCards[3].id, // Zsoldos (5 dmg, 7 hp)
      boostType: "DAMAGE_DOUBLE", // 10 dmg, 7 hp
      environmentId: medievalEnv.id,
    },
  ];

  const createdLeaderCards = [];
  for (const leader of leaderCards) {
    const created = await prisma.leaderCard.create({
      data: leader,
    });
    createdLeaderCards.push(created);
  }

  console.log(`✅ ${leaderCards.length} vezérkártya létrehozva (3 környezet × 3 vezér)`);

  // ============================================
  // 5. KAZAMATÁK LÉTREHOZÁSA
  // ============================================
  console.log("🏰 Kazamaták létrehozása...");

  // Fantasy kazamaták - progresszív nehézség
  await prisma.dungeon.create({
    data: {
      name: "Gyors Csata",
      type: "SIMPLE_ENCOUNTER",
      order: 1,
      requiredWins: 0,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[4].id }, // Goblin (3,5)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Goblin Barlang",
      type: "SMALL_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[4].id }, // Goblin (3,5)
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[3].id }, // Ork (4,6)
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[4].id }, // Goblin (3,5)
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[1].id }, // Ork Főnök (4,12)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Nazgûl Végzete",
      type: "LARGE_DUNGEON",
      order: 3,
      requiredWins: 2,
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[3].id }, // Ork (4,6)
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[4].id }, // Goblin (3,5)
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[3].id }, // Ork (4,6)
          { order: 3, isLeader: false, worldCardId: createdFantasyCards[4].id }, // Goblin (3,5)
          { order: 4, isLeader: false, worldCardId: createdFantasyCards[3].id }, // Ork (4,6)
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[0].id }, // Nazgûl Vezér (16,10)
        ],
      },
    },
  });

  // Sci-Fi kazamaták
  await prisma.dungeon.create({
    data: {
      name: "Támadás a Csillagromboló ellen",
      type: "SMALL_DUNGEON",
      order: 1,
      requiredWins: 0,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[3].id }, // Stormtrooper (4,5)
          { order: 1, isLeader: false, worldCardId: createdScifiCards[4].id }, // TIE Pilóta (5,6)
          { order: 2, isLeader: false, worldCardId: createdScifiCards[3].id }, // Stormtrooper (4,5)
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[4].id }, // Stormtrooper Parancsnok (4,10)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Birodalom Ellentámadása",
      type: "LARGE_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[3].id }, // Stormtrooper (4,5)
          { order: 1, isLeader: false, worldCardId: createdScifiCards[4].id }, // TIE Pilóta (5,6)
          { order: 2, isLeader: false, worldCardId: createdScifiCards[3].id }, // Stormtrooper (4,5)
          { order: 3, isLeader: false, worldCardId: createdScifiCards[4].id }, // TIE Pilóta (5,6)
          { order: 4, isLeader: false, worldCardId: createdScifiCards[3].id }, // Stormtrooper (4,5)
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[3].id }, // Darth Vader (20,12)
        ],
      },
    },
  });

  // Középkori kazamaták
  await prisma.dungeon.create({
    data: {
      name: "Sherwoodi Erdő",
      type: "SMALL_DUNGEON",
      order: 1,
      requiredWins: 0,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[3].id }, // Zsoldos (5,7)
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[3].id }, // Zsoldos (5,7)
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Fekete Lovag (7,8)
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[7].id }, // Fekete Lovag Vezér (7,16)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Sárkány Birodalma",
      type: "LARGE_DUNGEON",
      order: 2,
      requiredWins: 1,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[3].id }, // Zsoldos (5,7)
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Fekete Lovag (7,8)
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[3].id }, // Zsoldos (5,7)
          { order: 3, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Fekete Lovag (7,8)
          { order: 4, isLeader: false, worldCardId: createdMedievalCards[3].id }, // Zsoldos (5,7)
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[6].id }, // Sárkány Úr (20,11)
        ],
      },
    },
  });

  console.log(`✅ ${7} kazamata létrehozva (3 környezet × 2-3 kazamata)`);

  // ============================================
  // 6. JÁTÉKOK ÉS JÁTÉKOS ADATOK LÉTREHOZÁSA
  // ============================================
  console.log("🎮 Játékok létrehozása...");

  // Játékos 1 játéka - Fantasy vezérkártyák jó boostokkal
  await prisma.game.create({
    data: {
      name: "Első Kaland",
      userId: player1.id,
      environmentId: fantasyEnv.id,
      playerCards: {
        create: [
          // Fantasy vezérkártyák
          { baseCardId: createdLeaderCards[0].id, damageBoost: 5, healthBoost: 3 }, // Nazgûl Vezér
          { baseCardId: createdLeaderCards[1].id, damageBoost: 4, healthBoost: 2 }, // Ork Főnök
          { baseCardId: createdLeaderCards[2].id, damageBoost: 3, healthBoost: 4 }, // Goblin Király
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  // Játékos 2 játéka - Sci-Fi vezérkártyák
  await prisma.game.create({
    data: {
      name: "Galaktikus Hadjárat",
      userId: player2.id,
      environmentId: scifiEnv.id,
      playerCards: {
        create: [
          // Sci-Fi vezérkártyák
          { baseCardId: createdLeaderCards[3].id, damageBoost: 5, healthBoost: 3 }, // Darth Vader
          { baseCardId: createdLeaderCards[4].id, damageBoost: 4, healthBoost: 4 }, // Stormtrooper Parancsnok
          { baseCardId: createdLeaderCards[5].id, damageBoost: 3, healthBoost: 2 }, // TIE Vadász Ász
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  // Játékos 3 játéka - Középkori vezérkártyák
  await prisma.game.create({
    data: {
      name: "Lovagi Becsület",
      userId: player3.id,
      environmentId: medievalEnv.id,
      playerCards: {
        create: [
          // Középkori vezérkártyák
          { baseCardId: createdLeaderCards[6].id, damageBoost: 6, healthBoost: 3 }, // Sárkány Úr
          { baseCardId: createdLeaderCards[7].id, damageBoost: 5, healthBoost: 3 }, // Fekete Lovag Vezér
          { baseCardId: createdLeaderCards[8].id, damageBoost: 4, healthBoost: 4 }, // Zsoldos Kapitány
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  console.log(`✅ ${3} játék létrehozva vezérkártyákkal`);

  // ============================================
  // ÖSSZEFOGLALÓ
  // ============================================
  console.log("\n🎉 Adatbázis sikeresen feltöltve!");
  console.log("=====================================");
  console.log(`👥 Felhasználók: 5 (2 webmester, 3 játékos)`);
  console.log(`   - Admin: admin@damareen.hu / 1234`);
  console.log(`   - Webmester: webmaster@damareen.hu / 1234`);
  console.log(`   - Játékos 1: jatekos1@damareen.hu / 1234`);
  console.log(`   - Játékos 2: jatekos2@damareen.hu / 1234`);
  console.log(`   - Játékos 3: jatekos3@damareen.hu / 1234`);
  console.log(`🌍 Környezetek: 3`);
  console.log(`🎴 Világkártyák: 18 (3 környezet × 6 kártya)`);
  console.log(`   - Fantasy: 3 erős + 3 gyenge`);
  console.log(`   - Sci-Fi: 3 erős + 3 gyenge`);
  console.log(`   - Középkori: 3 erős + 3 gyenge`);
  console.log(`👑 Vezérkártyák: 9 (3 környezet × 3 vezér)`);
  console.log(`🏰 Kazamaták: 7`);
  console.log(`🎮 Játékok: 3 (különböző környezetekkel)`);
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
