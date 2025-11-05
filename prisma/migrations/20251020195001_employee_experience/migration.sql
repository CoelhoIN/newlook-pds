/*
  Warnings:

  - Added the required column `experience` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "experience" TEXT NOT NULL;
