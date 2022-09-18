/*
  Warnings:

  - You are about to drop the column `class` on the `UserClassification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserClassification" DROP COLUMN "class",
ADD COLUMN     "attitude" "Attitude" NOT NULL DEFAULT 'POSITIVE';
