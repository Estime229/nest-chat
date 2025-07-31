/*
  Warnings:

  - A unique constraint covering the columns `[avatarFilekey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarFilekey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarFilekey_key" ON "User"("avatarFilekey");
