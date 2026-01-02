-- CreateTable
CREATE TABLE "drafts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "leagueId" TEXT,
    "commissioner" TEXT NOT NULL,
    "managers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "commissioner" TEXT NOT NULL,
    "managers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_universe" (
    "id" TEXT NOT NULL,
    "ottoneuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fangraphsId" TEXT,
    "mlbamId" TEXT,
    "birthday" TEXT,
    "positions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_universe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drafts_commissioner_idx" ON "drafts"("commissioner");

-- CreateIndex
CREATE INDEX "drafts_managers_idx" ON "drafts" USING GIN ("managers");

-- CreateIndex
CREATE INDEX "leagues_commissioner_idx" ON "leagues"("commissioner");

-- CreateIndex
CREATE INDEX "leagues_managers_idx" ON "leagues" USING GIN ("managers");

-- CreateIndex
CREATE UNIQUE INDEX "player_universe_ottoneuId_key" ON "player_universe"("ottoneuId");

-- CreateIndex
CREATE INDEX "player_universe_ottoneuId_idx" ON "player_universe"("ottoneuId");
