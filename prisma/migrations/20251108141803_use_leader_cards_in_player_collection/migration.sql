-- DropForeignKey
ALTER TABLE `player_cards` DROP FOREIGN KEY `player_cards_baseCardId_fkey`;

-- DropIndex
DROP INDEX `player_cards_baseCardId_fkey` ON `player_cards`;

-- AddForeignKey
ALTER TABLE `player_cards` ADD CONSTRAINT `player_cards_baseCardId_fkey` FOREIGN KEY (`baseCardId`) REFERENCES `leader_cards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
