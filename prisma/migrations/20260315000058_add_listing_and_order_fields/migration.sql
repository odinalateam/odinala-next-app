-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "developmentStatus" TEXT NOT NULL DEFAULT 'completed',
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "maxInstallment" INTEGER,
ADD COLUMN     "planStatus" TEXT,
ADD COLUMN     "pricePerInstallment" DOUBLE PRECISION,
ADD COLUMN     "purchaseType" TEXT NOT NULL DEFAULT 'one_off';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "installmentMonths" INTEGER,
ADD COLUMN     "paymentOption" TEXT NOT NULL DEFAULT 'outright';
