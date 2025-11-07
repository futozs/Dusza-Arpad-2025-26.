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
  // 3. VILÁGKÁRTYÁK LÉTREHOZÁSA (FANTASY)
  // ============================================
  console.log("🎴 Világkártyák létrehozása...");

  const fantasyCards = [
    { name: "Aragorn", damage: 8, health: 12, type: "FIRE", order: 1 },
    { name: "Gandalf", damage: 15, health: 8, type: "AIR", order: 2 },
    { name: "Legolas", damage: 10, health: 10, type: "EARTH", order: 3 },
    { name: "Gimli", damage: 12, health: 15, type: "EARTH", order: 4 },
    { name: "Frodo", damage: 5, health: 8, type: "WATER", order: 5 },
    { name: "Sam", damage: 6, health: 10, type: "EARTH", order: 6 },
    { name: "Boromir", damage: 11, health: 13, type: "FIRE", order: 7 },
    { name: "Éowyn", damage: 9, health: 11, type: "AIR", order: 8 },
    { name: "Faramir", damage: 8, health: 9, type: "WATER", order: 9 },
    { name: "Treebeard", damage: 13, health: 20, type: "EARTH", order: 10 },
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

  // Sci-Fi kártyák
  const scifiCards = [
    { name: "Luke Skywalker", damage: 10, health: 12, type: "AIR", order: 1 },
    { name: "Darth Vader", damage: 18, health: 15, type: "FIRE", order: 2 },
    { name: "Yoda", damage: 14, health: 10, type: "EARTH", order: 3 },
    { name: "Han Solo", damage: 9, health: 11, type: "FIRE", order: 4 },
    { name: "Leia Organa", damage: 7, health: 9, type: "WATER", order: 5 },
    { name: "Chewbacca", damage: 12, health: 16, type: "EARTH", order: 6 },
    { name: "Obi-Wan Kenobi", damage: 11, health: 10, type: "AIR", order: 7 },
    { name: "R2-D2", damage: 4, health: 8, type: "WATER", order: 8 },
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

  // Középkori kártyák
  const medievalCards = [
    { name: "Artúr Király", damage: 14, health: 16, type: "FIRE", order: 1 },
    { name: "Lancelot", damage: 13, health: 14, type: "FIRE", order: 2 },
    { name: "Merlin", damage: 16, health: 9, type: "AIR", order: 3 },
    { name: "Guinevere", damage: 8, health: 11, type: "WATER", order: 4 },
    { name: "Robin Hood", damage: 10, health: 10, type: "EARTH", order: 5 },
    { name: "Morgana", damage: 15, health: 10, type: "FIRE", order: 6 },
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

  console.log(`✅ ${fantasyCards.length + scifiCards.length + medievalCards.length} világkártya létrehozva`);

  // ============================================
  // 4. VEZÉRKÁRTYÁK LÉTREHOZÁSA
  // ============================================
  console.log("👑 Vezérkártyák létrehozása...");

  const leaderCards = [
    // Fantasy vezérek
    {
      name: "Aragorn, a Király",
      baseCardId: createdFantasyCards[0].id,
      boostType: "DAMAGE_DOUBLE",
      environmentId: fantasyEnv.id,
    },
    {
      name: "Gandalf, a Fehér",
      baseCardId: createdFantasyCards[1].id,
      boostType: "DAMAGE_DOUBLE",
      environmentId: fantasyEnv.id,
    },
    {
      name: "Treebeard, az Ent",
      baseCardId: createdFantasyCards[9].id,
      boostType: "HEALTH_DOUBLE",
      environmentId: fantasyEnv.id,
    },
    // Sci-Fi vezérek
    {
      name: "Darth Vader, Sith Lord",
      baseCardId: createdScifiCards[1].id,
      boostType: "DAMAGE_DOUBLE",
      environmentId: scifiEnv.id,
    },
    {
      name: "Yoda, Jedi Mester",
      baseCardId: createdScifiCards[2].id,
      boostType: "HEALTH_DOUBLE",
      environmentId: scifiEnv.id,
    },
    // Középkori vezérek
    {
      name: "Artúr, Excalibur ura",
      baseCardId: createdMedievalCards[0].id,
      boostType: "DAMAGE_DOUBLE",
      environmentId: medievalEnv.id,
    },
    {
      name: "Merlin, az Ősi",
      baseCardId: createdMedievalCards[2].id,
      boostType: "DAMAGE_DOUBLE",
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

  console.log(`✅ ${leaderCards.length} vezérkártya létrehozva`);

  // ============================================
  // 5. KAZAMATÁK LÉTREHOZÁSA
  // ============================================
  console.log("🏰 Kazamaták létrehozása...");

  // Fantasy kazamaták
  const fantasyDungeon1 = await prisma.dungeon.create({
    data: {
      name: "A Mélység Királynője",
      type: "LARGE_DUNGEON",
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[4].id },
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[5].id },
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[2].id },
          { order: 3, isLeader: false, worldCardId: createdFantasyCards[6].id },
          { order: 4, isLeader: false, worldCardId: createdFantasyCards[3].id },
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[2].id },
        ],
      },
    },
  });

  const fantasyDungeon2 = await prisma.dungeon.create({
    data: {
      name: "Gandalf Próbája",
      type: "SMALL_DUNGEON",
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[7].id },
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[8].id },
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[0].id },
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[1].id },
        ],
      },
    },
  });

  const fantasyDungeon3 = await prisma.dungeon.create({
    data: {
      name: "Gyors Csata",
      type: "SIMPLE_ENCOUNTER",
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[1].id },
        ],
      },
    },
  });

  // Sci-Fi kazamaták
  const scifiDungeon1 = await prisma.dungeon.create({
    data: {
      name: "A Birodalom Ellentámadása",
      type: "LARGE_DUNGEON",
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[3].id },
          { order: 1, isLeader: false, worldCardId: createdScifiCards[4].id },
          { order: 2, isLeader: false, worldCardId: createdScifiCards[5].id },
          { order: 3, isLeader: false, worldCardId: createdScifiCards[6].id },
          { order: 4, isLeader: false, worldCardId: createdScifiCards[0].id },
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[3].id },
        ],
      },
    },
  });

  const scifiDungeon2 = await prisma.dungeon.create({
    data: {
      name: "Yoda Tanítása",
      type: "SMALL_DUNGEON",
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[7].id },
          { order: 1, isLeader: false, worldCardId: createdScifiCards[4].id },
          { order: 2, isLeader: false, worldCardId: createdScifiCards[0].id },
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[4].id },
        ],
      },
    },
  });

  // Középkori kazamaták
  const medievalDungeon1 = await prisma.dungeon.create({
    data: {
      name: "Camelot Védelme",
      type: "LARGE_DUNGEON",
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[3].id },
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[4].id },
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[1].id },
          { order: 3, isLeader: false, worldCardId: createdMedievalCards[5].id },
          { order: 4, isLeader: false, worldCardId: createdMedievalCards[0].id },
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[5].id },
        ],
      },
    },
  });

  console.log(`✅ ${7} kazamata létrehozva`);

  // ============================================
  // 6. JÁTÉKOK ÉS JÁTÉKOS ADATOK LÉTREHOZÁSA
  // ============================================
  console.log("🎮 Játékok létrehozása...");

  // Játékos 1 játéka
  const game1 = await prisma.game.create({
    data: {
      name: "Első Kaland",
      userId: player1.id,
      environmentId: fantasyEnv.id,
      playerCards: {
        create: [
          { baseCardId: createdFantasyCards[0].id, damageBoost: 2, healthBoost: 0 },
          { baseCardId: createdFantasyCards[1].id, damageBoost: 0, healthBoost: 3 },
          { baseCardId: createdFantasyCards[2].id, damageBoost: 1, healthBoost: 1 },
          { baseCardId: createdFantasyCards[3].id, damageBoost: 0, healthBoost: 2 },
          { baseCardId: createdFantasyCards[4].id, damageBoost: 3, healthBoost: 0 },
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  // Játékos 2 játéka
  const game2 = await prisma.game.create({
    data: {
      name: "Galaktikus Hadjárat",
      userId: player2.id,
      environmentId: scifiEnv.id,
      playerCards: {
        create: [
          { baseCardId: createdScifiCards[0].id, damageBoost: 0, healthBoost: 0 },
          { baseCardId: createdScifiCards[1].id, damageBoost: 0, healthBoost: 0 },
          { baseCardId: createdScifiCards[2].id, damageBoost: 0, healthBoost: 0 },
          { baseCardId: createdScifiCards[3].id, damageBoost: 0, healthBoost: 0 },
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  // Játékos 3 játéka
  const game3 = await prisma.game.create({
    data: {
      name: "Lovagi Becsület",
      userId: player3.id,
      environmentId: medievalEnv.id,
      playerCards: {
        create: [
          { baseCardId: createdMedievalCards[0].id, damageBoost: 5, healthBoost: 2 },
          { baseCardId: createdMedievalCards[1].id, damageBoost: 3, healthBoost: 1 },
          { baseCardId: createdMedievalCards[2].id, damageBoost: 2, healthBoost: 0 },
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  console.log(`✅ ${3} játék létrehozva játékos kártyákkal`);

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
  console.log(`🎴 Világkártyák: ${fantasyCards.length + scifiCards.length + medievalCards.length}`);
  console.log(`👑 Vezérkártyák: ${leaderCards.length}`);
  console.log(`🏰 Kazamaták: 7`);
  console.log(`🎮 Játékok: 3 (különböző előrehaladással)`);
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
