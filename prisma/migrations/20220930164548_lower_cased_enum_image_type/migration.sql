/*
  Warnings:

  - The values [PNG] on the enum `ImageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ImageType_new" AS ENUM ('png');
ALTER TABLE "ProfileImage" ALTER COLUMN "type" TYPE "ImageType_new" USING ("type"::text::"ImageType_new");
ALTER TYPE "ImageType" RENAME TO "ImageType_old";
ALTER TYPE "ImageType_new" RENAME TO "ImageType";
DROP TYPE "ImageType_old";
COMMIT;
