/*
  Warnings:

  - Added the required column `coverUrl` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "coverUrl" TEXT NOT NULL;
