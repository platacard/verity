/*
  Warnings:

  - A unique constraint covering the columns `[ciToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ciToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_ciToken_key" ON "User"("ciToken");
