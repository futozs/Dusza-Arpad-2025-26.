-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `world_cards` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `damage` INTEGER NOT NULL,
    `health` INTEGER NOT NULL,
    `type` ENUM('EARTH', 'AIR', 'WATER', 'FIRE') NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `environmentId` VARCHAR(191) NULL,

    UNIQUE INDEX `world_cards_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leader_cards` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `boostType` ENUM('DAMAGE_DOUBLE', 'HEALTH_DOUBLE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `baseCardId` VARCHAR(191) NOT NULL,
    `environmentId` VARCHAR(191) NULL,

    UNIQUE INDEX `leader_cards_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dungeons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('SIMPLE_ENCOUNTER', 'SMALL_DUNGEON', 'LARGE_DUNGEON') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `environmentId` VARCHAR(191) NULL,

    UNIQUE INDEX `dungeons_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dungeon_cards` (
    `id` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `isLeader` BOOLEAN NOT NULL DEFAULT false,
    `dungeonId` VARCHAR(191) NOT NULL,
    `worldCardId` VARCHAR(191) NULL,
    `leaderCardId` VARCHAR(191) NULL,
    `baseLeaderCardId` VARCHAR(191) NULL,

    UNIQUE INDEX `dungeon_cards_dungeonId_order_key`(`dungeonId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `environments` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `environments_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_cards` (
    `id` VARCHAR(191) NOT NULL,
    `damageBoost` INTEGER NOT NULL DEFAULT 0,
    `healthBoost` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `baseCardId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `player_cards_gameId_baseCardId_key`(`gameId`, `baseCardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `decks` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deck_cards` (
    `id` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `deckId` VARCHAR(191) NOT NULL,
    `playerCardId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `deck_cards_deckId_order_key`(`deckId`, `order`),
    UNIQUE INDEX `deck_cards_deckId_playerCardId_key`(`deckId`, `playerCardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `games` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `environmentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battles` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('IN_PROGRESS', 'WON', 'LOST') NOT NULL DEFAULT 'IN_PROGRESS',
    `playerWins` INTEGER NOT NULL DEFAULT 0,
    `dungeonWins` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `deckId` VARCHAR(191) NOT NULL,
    `dungeonId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clashes` (
    `id` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `winner` ENUM('PLAYER', 'DUNGEON') NOT NULL,
    `winReason` ENUM('DAMAGE', 'TYPE_ADVANTAGE', 'DEFAULT') NOT NULL,
    `playerDamage` INTEGER NOT NULL,
    `playerHealth` INTEGER NOT NULL,
    `dungeonDamage` INTEGER NOT NULL,
    `dungeonHealth` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `battleId` VARCHAR(191) NOT NULL,
    `playerCardName` VARCHAR(191) NOT NULL,
    `dungeonCardName` VARCHAR(191) NOT NULL,
    `playerCardType` ENUM('EARTH', 'AIR', 'WATER', 'FIRE') NOT NULL,
    `dungeonCardType` ENUM('EARTH', 'AIR', 'WATER', 'FIRE') NOT NULL,

    UNIQUE INDEX `clashes_battleId_order_key`(`battleId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `world_cards` ADD CONSTRAINT `world_cards_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `environments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leader_cards` ADD CONSTRAINT `leader_cards_baseCardId_fkey` FOREIGN KEY (`baseCardId`) REFERENCES `world_cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leader_cards` ADD CONSTRAINT `leader_cards_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `environments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dungeons` ADD CONSTRAINT `dungeons_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `environments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dungeon_cards` ADD CONSTRAINT `dungeon_cards_dungeonId_fkey` FOREIGN KEY (`dungeonId`) REFERENCES `dungeons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dungeon_cards` ADD CONSTRAINT `dungeon_cards_worldCardId_fkey` FOREIGN KEY (`worldCardId`) REFERENCES `world_cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dungeon_cards` ADD CONSTRAINT `dungeon_cards_leaderCardId_fkey` FOREIGN KEY (`leaderCardId`) REFERENCES `leader_cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dungeon_cards` ADD CONSTRAINT `dungeon_cards_baseLeaderCardId_fkey` FOREIGN KEY (`baseLeaderCardId`) REFERENCES `world_cards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_cards` ADD CONSTRAINT `player_cards_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_cards` ADD CONSTRAINT `player_cards_baseCardId_fkey` FOREIGN KEY (`baseCardId`) REFERENCES `world_cards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `decks` ADD CONSTRAINT `decks_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deck_cards` ADD CONSTRAINT `deck_cards_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `decks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deck_cards` ADD CONSTRAINT `deck_cards_playerCardId_fkey` FOREIGN KEY (`playerCardId`) REFERENCES `player_cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `environments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `decks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_dungeonId_fkey` FOREIGN KEY (`dungeonId`) REFERENCES `dungeons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clashes` ADD CONSTRAINT `clashes_battleId_fkey` FOREIGN KEY (`battleId`) REFERENCES `battles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
