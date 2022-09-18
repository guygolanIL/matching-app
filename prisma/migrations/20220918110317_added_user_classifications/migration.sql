-- CreateEnum
CREATE TYPE "ClassificationAttitude" AS ENUM ('POSITIVE', 'NEGATIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserClassification" (
    "attitude" "ClassificationAttitude" NOT NULL,
    "classifierUserId" INTEGER NOT NULL,
    "classifiedUserId" INTEGER NOT NULL,

    CONSTRAINT "UserClassification_pkey" PRIMARY KEY ("classifierUserId","classifiedUserId")
);

-- AddForeignKey
ALTER TABLE "UserClassification" ADD CONSTRAINT "UserClassification_classifierUserId_fkey" FOREIGN KEY ("classifierUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClassification" ADD CONSTRAINT "UserClassification_classifiedUserId_fkey" FOREIGN KEY ("classifiedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
