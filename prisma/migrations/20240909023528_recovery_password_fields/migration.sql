/*
  Warnings:

  - You are about to drop the column `codeChangePassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeChangePassword",
ADD COLUMN     "recoveryPasswordToken" TEXT,
ADD COLUMN     "recoveryPasswordTokenExpiration" TIMESTAMP(3);
