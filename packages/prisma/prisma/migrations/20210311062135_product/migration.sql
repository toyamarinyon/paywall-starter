/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "product_type" AS ENUM ('classic', 'pre_order');

-- DropTable
DROP TABLE "Product";

-- DropEnum
DROP TYPE "ProductType";

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "stripe_proruct_id" TEXT NOT NULL,
    "product_type" "product_type" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_access_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products.stripe_proruct_id_unique" ON "products"("stripe_proruct_id");

-- AddForeignKey
ALTER TABLE "product_access_tokens" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_access_tokens" ADD FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
