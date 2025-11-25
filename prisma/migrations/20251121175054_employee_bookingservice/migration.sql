-- AlterTable
ALTER TABLE "BookingService" ADD COLUMN     "employeeId" INTEGER;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
