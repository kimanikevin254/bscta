-- DropForeignKey
ALTER TABLE `ConversionHistory` DROP FOREIGN KEY `ConversionHistory_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `ConversionHistory` DROP FOREIGN KEY `ConversionHistory_leadId_fkey`;

-- DropForeignKey
ALTER TABLE `Interaction` DROP FOREIGN KEY `Interaction_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `Interaction` DROP FOREIGN KEY `Interaction_leadId_fkey`;

-- AddForeignKey
ALTER TABLE `Interaction` ADD CONSTRAINT `Interaction_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interaction` ADD CONSTRAINT `Interaction_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversionHistory` ADD CONSTRAINT `ConversionHistory_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversionHistory` ADD CONSTRAINT `ConversionHistory_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
