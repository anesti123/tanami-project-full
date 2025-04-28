/*
  Warnings:

  - You are about to drop the column `content` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `action` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "content",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "opportunity" TEXT;
