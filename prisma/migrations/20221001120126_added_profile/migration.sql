/*
  Warnings:

  - You are about to drop the column `userId` on the `ProfileImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userProfileId]` on the table `ProfileImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userProfileId` to the `ProfileImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProfileImage" DROP CONSTRAINT "ProfileImage_userId_fkey";

-- DropIndex
DROP INDEX "ProfileImage_userId_key";

-- AlterTable
ALTER TABLE "ProfileImage" DROP COLUMN "userId",
ADD COLUMN     "userProfileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImage_userProfileId_key" ON "ProfileImage"("userProfileId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileImage" ADD CONSTRAINT "ProfileImage_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
