/*
  Warnings:

  - You are about to drop the column `stripeId` on the `stripe_billing_relations` table. All the data in the column will be lost.
  - Added the required column `stripe_id` to the `stripe_billing_relations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('paid', 'open');

-- AlterTable
ALTER TABLE "stripe_billing_relations" DROP COLUMN "stripeId",
ADD COLUMN     "stripe_id" TEXT NOT NULL,
ADD COLUMN     "billing_status" "BillingStatus" NOT NULL DEFAULT E'paid';
