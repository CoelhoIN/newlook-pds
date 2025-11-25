/*
  Warnings:

  - You are about to drop the column `customerName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
ADD COLUMN     "costumerName" TEXT,
ADD COLUMN     "costumerPhone" TEXT;
