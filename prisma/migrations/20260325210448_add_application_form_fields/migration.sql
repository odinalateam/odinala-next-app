-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "applicationFormUrl" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "applicationFormReleased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "filledApplicationFormUrl" TEXT;
