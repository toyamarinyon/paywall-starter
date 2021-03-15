/*
  Warnings:

  - You are about to drop the column `stripeCheckoutId` on the `product_access_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `product_access_tokens` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[stripe_checkout_id]` on the table `product_access_tokens`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[stripe_payment_intent_id]` on the table `product_access_tokens`. If there are existing duplicate values, the migration will fail.
  - Added the required column `stripe_checkout_id` to the `product_access_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_payment_intent_id` to the `product_access_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_access_tokens.stripePaymentIntentId_unique";

-- DropIndex
DROP INDEX "product_access_tokens.stripeCheckoutId_unique";

-- AlterTable
ALTER TABLE "product_access_tokens" DROP COLUMN "stripeCheckoutId",
DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "stripe_checkout_id" TEXT NOT NULL,
ADD COLUMN     "stripe_payment_intent_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_access_tokens.stripe_checkout_id_unique" ON "product_access_tokens"("stripe_checkout_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_access_tokens.stripe_payment_intent_id_unique" ON "product_access_tokens"("stripe_payment_intent_id");
