/*
  Warnings:

  - You are about to drop the column `stripe_checkout_id` on the `product_access_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_payment_intent_id` on the `product_access_tokens` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[stripe_billin_relation_id]` on the table `product_access_tokens`. If there are existing duplicate values, the migration will fail.
  - Added the required column `stripe_billin_relation_id` to the `product_access_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollectionMethod" AS ENUM ('checkout', 'sendInvoice');

-- DropIndex
DROP INDEX "product_access_tokens.stripe_payment_intent_id_unique";

-- DropIndex
DROP INDEX "product_access_tokens.stripe_checkout_id_unique";

-- AlterTable
ALTER TABLE "product_access_tokens" DROP COLUMN "stripe_checkout_id",
DROP COLUMN "stripe_payment_intent_id",
ADD COLUMN     "stripe_billin_relation_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "stripe_billing_relations" (
    "id" SERIAL NOT NULL,
    "collectionMethod" "CollectionMethod" NOT NULL,
    "stripeId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_access_tokens_stripe_billin_relation_id_unique" ON "product_access_tokens"("stripe_billin_relation_id");

-- AddForeignKey
ALTER TABLE "product_access_tokens" ADD FOREIGN KEY ("stripe_billin_relation_id") REFERENCES "stripe_billing_relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
