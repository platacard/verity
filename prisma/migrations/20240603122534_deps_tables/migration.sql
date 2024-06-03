-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppVersion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL,
    "builtAt" TIMESTAMP(3),
    "appId" TEXT NOT NULL,

    CONSTRAINT "AppVersion_pkey" PRIMARY KEY ("appId","value")
);

-- CreateTable
CREATE TABLE "AppVersionDependency" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dependantAppVersionId" INTEGER NOT NULL,
    "dependencyAppVersionId" INTEGER NOT NULL,

    CONSTRAINT "AppVersionDependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_id_key" ON "App"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AppVersion_id_key" ON "AppVersion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AppVersionDependency_id_key" ON "AppVersionDependency"("id");

-- AddForeignKey
ALTER TABLE "AppVersion" ADD CONSTRAINT "AppVersion_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppVersionDependency" ADD CONSTRAINT "AppVersionDependency_dependantAppVersionId_fkey" FOREIGN KEY ("dependantAppVersionId") REFERENCES "AppVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppVersionDependency" ADD CONSTRAINT "AppVersionDependency_dependencyAppVersionId_fkey" FOREIGN KEY ("dependencyAppVersionId") REFERENCES "AppVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
