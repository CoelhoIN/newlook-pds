/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_serviceId_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "serviceId";

-- CreateTable
CREATE TABLE "public"."_EmployeeServices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EmployeeServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EmployeeServices_B_index" ON "public"."_EmployeeServices"("B");

-- AddForeignKey
ALTER TABLE "public"."_EmployeeServices" ADD CONSTRAINT "_EmployeeServices_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EmployeeServices" ADD CONSTRAINT "_EmployeeServices_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
