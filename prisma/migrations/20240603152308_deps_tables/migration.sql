-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL,
    "builtAt" TIMESTAMP(3),
    "appId" TEXT NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("appId","value")
);

-- CreateTable
CREATE TABLE "Dependency" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dependantAppVersionId" INTEGER NOT NULL,
    "dependencyAppVersionId" INTEGER NOT NULL,

    CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_id_key" ON "App"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Version_id_key" ON "Version"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dependency_id_key" ON "Dependency"("id");

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependantAppVersionId_fkey" FOREIGN KEY ("dependantAppVersionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependencyAppVersionId_fkey" FOREIGN KEY ("dependencyAppVersionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;
