/*
  Warnings:

  - The `duration` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER;
