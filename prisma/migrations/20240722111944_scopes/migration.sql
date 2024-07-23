/*
  Warnings:

  - Added the required column `scopeId` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scopeId` to the `Dependency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scopeId` to the `Version` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "App" ADD COLUMN     "scopeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AuditLogs" ADD COLUMN     "scopeId" INTEGER;

-- AlterTable
ALTER TABLE "Dependency" ADD COLUMN     "scopeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Version" ADD COLUMN     "scopeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Scope" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserScopes" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Scope_id_key" ON "Scope"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserScopes_AB_unique" ON "_UserScopes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserScopes_B_index" ON "_UserScopes"("B");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserScopes" ADD CONSTRAINT "_UserScopes_A_fkey" FOREIGN KEY ("A") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserScopes" ADD CONSTRAINT "_UserScopes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
