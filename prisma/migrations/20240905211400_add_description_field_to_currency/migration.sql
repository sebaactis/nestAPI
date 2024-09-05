/*
  Warnings:

  - Added the required column `description` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Currency" ADD COLUMN     "description" TEXT NOT NULL;
