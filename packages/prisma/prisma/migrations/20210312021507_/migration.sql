/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[user_id,product_id]` on the table `product_access_tokens`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_access_tokens.user_id_product_id_unique" ON "product_access_tokens"("user_id", "product_id");
