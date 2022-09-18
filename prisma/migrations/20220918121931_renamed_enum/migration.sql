/*
  Warnings:

  - The `class` column on the `UserClassification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Class" AS ENUM ('POSITIVE', 'NEGATIVE');

-- AlterTable
ALTER TABLE "UserClassification" DROP COLUMN "class",
ADD COLUMN     "class" "Class" NOT NULL DEFAULT 'POSITIVE';

-- DropEnum
DROP TYPE "ClassificationAttitude";
