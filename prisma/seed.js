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

  // Kártyák most NYERHETŐ értékekkel!
  // Játékos kártyák erősek lesznek (boost-tal együtt)
  // Kazamata kártyák gyengébbek
  const fantasyCards = [
    // Erős játékos kártyák (ezek kerülnek a játékos gyűjteményébe)
    { name: "Aragorn", damage: 12, health: 15, type: "FIRE", order: 1 },
    { name: "Gandalf", damage: 15, health: 12, type: "AIR", order: 2 },
    { name: "Legolas", damage: 13, health: 14, type: "EARTH", order: 3 },
    { name: "Gimli", damage: 14, health: 16, type: "EARTH", order: 4 },
    { name: "Boromir", damage: 16, health: 13, type: "FIRE", order: 5 },
    { name: "Éowyn", damage: 14, health: 13, type: "AIR", order: 6 },
    // Gyengébb ellenség kártyák (ezek kerülnek a kazamatákba)
    { name: "Ork Harcos", damage: 4, health: 6, type: "FIRE", order: 7 },
    { name: "Goblin", damage: 3, health: 5, type: "EARTH", order: 8 },
    { name: "Troll", damage: 6, health: 8, type: "WATER", order: 9 },
    { name: "Pók", damage: 5, health: 7, type: "AIR", order: 10 },
    { name: "Nazgûl", damage: 8, health: 10, type: "FIRE", order: 11 },
    { name: "Saruman Szolgája", damage: 7, health: 9, type: "WATER", order: 12 },
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
    // Erős játékos kártyák
    { name: "Luke Skywalker", damage: 14, health: 13, type: "AIR", order: 1 },
    { name: "Han Solo", damage: 12, health: 14, type: "FIRE", order: 2 },
    { name: "Leia Organa", damage: 13, health: 12, type: "WATER", order: 3 },
    { name: "Chewbacca", damage: 15, health: 16, type: "EARTH", order: 4 },
    { name: "Obi-Wan Kenobi", damage: 16, health: 11, type: "AIR", order: 5 },
    // Gyengébb ellenség kártyák
    { name: "Stormtrooper", damage: 4, health: 5, type: "FIRE", order: 6 },
    { name: "TIE Pilóta", damage: 5, health: 6, type: "AIR", order: 7 },
    { name: "Darth Vader", damage: 10, health: 12, type: "FIRE", order: 8 },
    { name: "Boba Fett", damage: 8, health: 9, type: "WATER", order: 9 },
    { name: "R2-D2", damage: 2, health: 8, type: "WATER", order: 10 },
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
    // Erős játékos kártyák
    { name: "Artúr Király", damage: 16, health: 15, type: "FIRE", order: 1 },
    { name: "Lancelot", damage: 15, health: 14, type: "FIRE", order: 2 },
    { name: "Merlin", damage: 17, health: 11, type: "AIR", order: 3 },
    { name: "Robin Hood", damage: 14, health: 13, type: "EARTH", order: 4 },
    // Gyengébb ellenség kártyák
    { name: "Zsoldos", damage: 5, health: 7, type: "FIRE", order: 5 },
    { name: "Fekete Lovag", damage: 7, health: 8, type: "EARTH", order: 6 },
    { name: "Morgana", damage: 9, health: 10, type: "AIR", order: 7 },
    { name: "Sárkány", damage: 10, health: 11, type: "FIRE", order: 8 },
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

  // Vezérek a GYENGE kártyákból - így legyőzhetőek!
  const leaderCards = [
    // Fantasy vezérek (gyenge kártyákból)
    {
      name: "Nazgûl Vezér",
      baseCardId: createdFantasyCards[10].id, // Nazgûl (8 dmg, 10 hp)
      boostType: "DAMAGE_DOUBLE", // 16 dmg, 10 hp
      environmentId: fantasyEnv.id,
    },
    {
      name: "Troll Király",
      baseCardId: createdFantasyCards[8].id, // Troll (6 dmg, 8 hp)
      boostType: "HEALTH_DOUBLE", // 6 dmg, 16 hp
      environmentId: fantasyEnv.id,
    },
    {
      name: "Ork Főnök",
      baseCardId: createdFantasyCards[6].id, // Ork (4 dmg, 6 hp)
      boostType: "DAMAGE_DOUBLE", // 8 dmg, 6 hp
      environmentId: fantasyEnv.id,
    },
    // Sci-Fi vezérek
    {
      name: "Darth Vader, Sith Lord",
      baseCardId: createdScifiCards[7].id, // Darth Vader (10 dmg, 12 hp)
      boostType: "DAMAGE_DOUBLE", // 20 dmg, 12 hp - erős de legyőzhető
      environmentId: scifiEnv.id,
    },
    {
      name: "Boba Fett, Fejvadász",
      baseCardId: createdScifiCards[8].id, // Boba Fett (8 dmg, 9 hp)
      boostType: "HEALTH_DOUBLE", // 8 dmg, 18 hp
      environmentId: scifiEnv.id,
    },
    // Középkori vezérek
    {
      name: "Sárkány Úr",
      baseCardId: createdMedievalCards[7].id, // Sárkány (10 dmg, 11 hp)
      boostType: "DAMAGE_DOUBLE", // 20 dmg, 11 hp
      environmentId: medievalEnv.id,
    },
    {
      name: "Morgana, Sötét Varázslónő",
      baseCardId: createdMedievalCards[6].id, // Morgana (9 dmg, 10 hp)
      boostType: "HEALTH_DOUBLE", // 9 dmg, 20 hp
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

  // Fantasy kazamaták - GYENGE ellenségekkel! + PROGRESSZIÓ
  await prisma.dungeon.create({
    data: {
      name: "Gyors Csata",
      type: "SIMPLE_ENCOUNTER",
      order: 1, // ELSŐ kazamata - azonnal elérhető
      requiredWins: 0, // Nincs előfeltétel
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork (4,6)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Goblin Barlang",
      type: "SMALL_DUNGEON",
      order: 2, // MÁSODIK kazamata
      requiredWins: 1, // 1 győzelem kell
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[7].id }, // Goblin (3,5)
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork (4,6)
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[9].id }, // Pók (5,7)
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[2].id }, // Ork Főnök (8,6)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Mélység Királynője",
      type: "LARGE_DUNGEON",
      order: 3, // HARMADIK kazamata - BOSS
      requiredWins: 2, // 2 győzelem kell
      environmentId: fantasyEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdFantasyCards[6].id }, // Ork (4,6)
          { order: 1, isLeader: false, worldCardId: createdFantasyCards[7].id }, // Goblin (3,5)
          { order: 2, isLeader: false, worldCardId: createdFantasyCards[8].id }, // Troll (6,8)
          { order: 3, isLeader: false, worldCardId: createdFantasyCards[9].id }, // Pók (5,7)
          { order: 4, isLeader: false, worldCardId: createdFantasyCards[11].id }, // Saruman szolgája (7,9)
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[0].id }, // Nazgûl Vezér (16,10)
        ],
      },
    },
  });

  // Sci-Fi kazamaták - GYENGE ellenségekkel! + PROGRESSZIÓ
  await prisma.dungeon.create({
    data: {
      name: "Támadás a Csillagromboló ellen",
      type: "SMALL_DUNGEON",
      order: 1, // ELSŐ
      requiredWins: 0,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[5].id }, // Stormtrooper (4,5)
          { order: 1, isLeader: false, worldCardId: createdScifiCards[6].id }, // TIE Pilóta (5,6)
          { order: 2, isLeader: false, worldCardId: createdScifiCards[6].id }, // TIE Pilóta (5,6)
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[4].id }, // Boba Fett Vezér (8,18)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "A Birodalom Ellentámadása",
      type: "LARGE_DUNGEON",
      order: 2, // MÁSODIK - BOSS
      requiredWins: 1,
      environmentId: scifiEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdScifiCards[5].id }, // Stormtrooper (4,5)
          { order: 1, isLeader: false, worldCardId: createdScifiCards[6].id }, // TIE Pilóta (5,6)
          { order: 2, isLeader: false, worldCardId: createdScifiCards[8].id }, // Boba Fett (8,9)
          { order: 3, isLeader: false, worldCardId: createdScifiCards[9].id }, // R2-D2 (2,8)
          { order: 4, isLeader: false, worldCardId: createdScifiCards[5].id }, // Stormtrooper (4,5)
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[3].id }, // Darth Vader (20,12)
        ],
      },
    },
  });

  // Középkori kazamaták - GYENGE ellenségekkel! + PROGRESSZIÓ
  await prisma.dungeon.create({
    data: {
      name: "Sherwoodi Erdő",
      type: "SMALL_DUNGEON",
      order: 1, // ELSŐ
      requiredWins: 0,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Zsoldos (5,7)
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Zsoldos (5,7)
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[5].id }, // Fekete Lovag (7,8)
          { order: 3, isLeader: true, leaderCardId: createdLeaderCards[6].id }, // Morgana Vezér (9,20)
        ],
      },
    },
  });

  await prisma.dungeon.create({
    data: {
      name: "Camelot Védelme",
      type: "LARGE_DUNGEON",
      order: 2, // MÁSODIK - BOSS
      requiredWins: 1,
      environmentId: medievalEnv.id,
      dungeonCards: {
        create: [
          { order: 0, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Zsoldos (5,7)
          { order: 1, isLeader: false, worldCardId: createdMedievalCards[5].id }, // Fekete Lovag (7,8)
          { order: 2, isLeader: false, worldCardId: createdMedievalCards[4].id }, // Zsoldos (5,7)
          { order: 3, isLeader: false, worldCardId: createdMedievalCards[6].id }, // Morgana (9,10)
          { order: 4, isLeader: false, worldCardId: createdMedievalCards[5].id }, // Fekete Lovag (7,8)
          { order: 5, isLeader: true, leaderCardId: createdLeaderCards[5].id }, // Sárkány Úr (20,11)
        ],
      },
    },
  });

  console.log(`✅ ${7} kazamata létrehozva`);

  // ============================================
  // 6. JÁTÉKOK ÉS JÁTÉKOS ADATOK LÉTREHOZÁSA
  // ============================================
  console.log("🎮 Játékok létrehozása...");

  // Játékos 1 játéka - ERŐS kártyák jó boostokkal!
  await prisma.game.create({
    data: {
      name: "Első Kaland",
      userId: player1.id,
      environmentId: fantasyEnv.id,
      playerCards: {
        create: [
          // Aragorn: 12+5=17 dmg, 15+3=18 hp - NAGYON ERŐ!
          { baseCardId: createdFantasyCards[0].id, damageBoost: 5, healthBoost: 3 },
          // Gandalf: 15+4=19 dmg, 12+2=14 hp
          { baseCardId: createdFantasyCards[1].id, damageBoost: 4, healthBoost: 2 },
          // Legolas: 13+3=16 dmg, 14+4=18 hp
          { baseCardId: createdFantasyCards[2].id, damageBoost: 3, healthBoost: 4 },
          // Gimli: 14+2=16 dmg, 16+3=19 hp
          { baseCardId: createdFantasyCards[3].id, damageBoost: 2, healthBoost: 3 },
          // Boromir: 16+4=20 dmg, 13+2=15 hp
          { baseCardId: createdFantasyCards[4].id, damageBoost: 4, healthBoost: 2 },
          // Éowyn: 14+3=17 dmg, 13+3=16 hp
          { baseCardId: createdFantasyCards[5].id, damageBoost: 3, healthBoost: 3 },
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  // Játékos 2 játéka - Sci-Fi erős kártyákkal
  await prisma.game.create({
    data: {
      name: "Galaktikus Hadjárat",
      userId: player2.id,
      environmentId: scifiEnv.id,
      playerCards: {
        create: [
          // Luke: 14+5=19 dmg, 13+3=16 hp
          { baseCardId: createdScifiCards[0].id, damageBoost: 5, healthBoost: 3 },
          // Han: 12+4=16 dmg, 14+4=18 hp
          { baseCardId: createdScifiCards[1].id, damageBoost: 4, healthBoost: 4 },
          // Leia: 13+3=16 dmg, 12+3=15 hp
          { baseCardId: createdScifiCards[2].id, damageBoost: 3, healthBoost: 3 },
          // Chewie: 15+3=18 dmg, 16+2=18 hp
          { baseCardId: createdScifiCards[3].id, damageBoost: 3, healthBoost: 2 },
          // Obi-Wan: 16+4=20 dmg, 11+4=15 hp
          { baseCardId: createdScifiCards[4].id, damageBoost: 4, healthBoost: 4 },
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  // Játékos 3 játéka - Középkori erős kártyákkal
  await prisma.game.create({
    data: {
      name: "Lovagi Becsület",
      userId: player3.id,
      environmentId: medievalEnv.id,
      playerCards: {
        create: [
          // Artúr: 16+6=22 dmg, 15+3=18 hp - HŐS!
          { baseCardId: createdMedievalCards[0].id, damageBoost: 6, healthBoost: 3 },
          // Lancelot: 15+5=20 dmg, 14+3=17 hp
          { baseCardId: createdMedievalCards[1].id, damageBoost: 5, healthBoost: 3 },
          // Merlin: 17+5=22 dmg, 11+4=15 hp
          { baseCardId: createdMedievalCards[2].id, damageBoost: 5, healthBoost: 4 },
          // Robin Hood: 14+4=18 dmg, 13+4=17 hp
          { baseCardId: createdMedievalCards[3].id, damageBoost: 4, healthBoost: 4 },
        ],
      },
    },
    include: {
      playerCards: true,
    },
  });

  console.log(`✅ ${3} játék létrehozva ERŐS játékos kártyákkal`);

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
