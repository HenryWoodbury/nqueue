/*
  Warnings:

  - Added the required column `userId` to the `drafts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drafts" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "drafts_userId_idx" ON "drafts"("userId");
