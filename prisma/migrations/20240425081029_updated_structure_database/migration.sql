/*
  Warnings:

  - You are about to alter the column `jobtitle` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(277)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `jobtitle` VARCHAR(191) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(277) NOT NULL;
