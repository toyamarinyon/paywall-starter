/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[stripeCheckoutId]` on the table `product_access_tokens`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[stripePaymentIntentId]` on the table `product_access_tokens`. If there are existing duplicate values, the migration will fail.
  - Added the required column `stripeCheckoutId` to the `product_access_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentIntentId` to the `product_access_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_access_tokens" ADD COLUMN     "stripeCheckoutId" TEXT NOT NULL,
ADD COLUMN     "stripePaymentIntentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_access_tokens.stripeCheckoutId_unique" ON "product_access_tokens"("stripeCheckoutId");

-- CreateIndex
CREATE UNIQUE INDEX "product_access_tokens.stripePaymentIntentId_unique" ON "product_access_tokens"("stripePaymentIntentId");
