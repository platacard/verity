/*
  Warnings:

  - The primary key for the `App` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AuditLogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Dependency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Scope` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Version` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLogs" DROP CONSTRAINT "AuditLogs_appId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLogs" DROP CONSTRAINT "AuditLogs_dependencyId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLogs" DROP CONSTRAINT "AuditLogs_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLogs" DROP CONSTRAINT "AuditLogs_versionId_fkey";

-- DropForeignKey
ALTER TABLE "Dependency" DROP CONSTRAINT "Dependency_dependantAppVersionId_fkey";

-- DropForeignKey
ALTER TABLE "Dependency" DROP CONSTRAINT "Dependency_dependencyAppVersionId_fkey";

-- DropForeignKey
ALTER TABLE "Dependency" DROP CONSTRAINT "Dependency_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_appId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "_UserScopes" DROP CONSTRAINT "_UserScopes_A_fkey";

-- AlterTable
ALTER TABLE "App" DROP CONSTRAINT "App_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "scopeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "App_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "App_id_seq";

-- AlterTable
ALTER TABLE "AuditLogs" DROP CONSTRAINT "AuditLogs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "appId" SET DATA TYPE TEXT,
ALTER COLUMN "versionId" SET DATA TYPE TEXT,
ALTER COLUMN "dependencyId" SET DATA TYPE TEXT,
ALTER COLUMN "scopeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AuditLogs_id_seq";

-- AlterTable
ALTER TABLE "Dependency" DROP CONSTRAINT "Dependency_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "dependantAppVersionId" SET DATA TYPE TEXT,
ALTER COLUMN "dependencyAppVersionId" SET DATA TYPE TEXT,
ALTER COLUMN "scopeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Dependency_id_seq";

-- AlterTable
ALTER TABLE "Scope" DROP CONSTRAINT "Scope_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Scope_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Scope_id_seq";

-- AlterTable
ALTER TABLE "Version" DROP CONSTRAINT "Version_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "appId" SET DATA TYPE TEXT,
ALTER COLUMN "scopeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Version_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Version_id_seq";

-- AlterTable
ALTER TABLE "_UserScopes" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependantAppVersionId_fkey" FOREIGN KEY ("dependantAppVersionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependencyAppVersionId_fkey" FOREIGN KEY ("dependencyAppVersionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_dependencyId_fkey" FOREIGN KEY ("dependencyId") REFERENCES "Dependency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserScopes" ADD CONSTRAINT "_UserScopes_A_fkey" FOREIGN KEY ("A") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
