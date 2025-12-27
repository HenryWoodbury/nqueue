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
CREATE UNIQUE INDEX "player_universe_ottoneuId_key" ON "player_universe"("ottoneuId");

-- CreateIndex
CREATE INDEX "player_universe_ottoneuId_idx" ON "player_universe"("ottoneuId");
