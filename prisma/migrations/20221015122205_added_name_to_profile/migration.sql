-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('INITIAL', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "name" TEXT,
ADD COLUMN     "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'INITIAL';
