/*
  Warnings:

  - You are about to drop the column `passportUrl` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `utilityBillUrl` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "proofOfPaymentUrl" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "passportUrl",
DROP COLUMN "utilityBillUrl",
ADD COLUMN     "nin" TEXT,
ADD COLUMN     "ninVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tinVerified" BOOLEAN NOT NULL DEFAULT false;
