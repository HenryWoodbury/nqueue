/*
  Warnings:

  - You are about to drop the column `commissioner` on the `drafts` table. All the data in the column will be lost.
  - You are about to drop the column `managers` on the `drafts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `drafts` table. All the data in the column will be lost.
  - You are about to drop the column `managers` on the `leagues` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkOrgId]` on the table `leagues` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkOrgId` to the `leagues` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "drafts_commissioner_idx";

-- DropIndex
DROP INDEX "drafts_managers_idx";

-- DropIndex
DROP INDEX "leagues_managers_idx";

-- AlterTable
ALTER TABLE "drafts" DROP COLUMN "commissioner",
DROP COLUMN "managers",
DROP COLUMN "name",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "leagues" DROP COLUMN "managers",
ADD COLUMN     "clerkOrgId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "leagues_clerkOrgId_key" ON "leagues"("clerkOrgId");

-- CreateIndex
CREATE INDEX "leagues_clerkOrgId_idx" ON "leagues"("clerkOrgId");

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
