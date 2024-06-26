/*
  Warnings:

  - The primary key for the `App` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `App` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Version` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `App` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `appId` on the `Version` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_appId_fkey";

-- AlterTable
ALTER TABLE "App" DROP CONSTRAINT "App_pkey",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "App_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Dependency" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Version" DROP CONSTRAINT "Version_pkey",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "appId",
ADD COLUMN     "appId" INTEGER NOT NULL,
ADD CONSTRAINT "Version_pkey" PRIMARY KEY ("appId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "App_id_key" ON "App"("id");

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
