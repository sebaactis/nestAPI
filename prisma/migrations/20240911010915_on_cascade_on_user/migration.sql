/*
  Warnings:

  - You are about to drop the column `userId` on the `Wallet` table. All the data in the column will be lost.
  - Made the column `walletId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- DropIndex
DROP INDEX "Wallet_userId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "walletId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
