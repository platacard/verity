import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const getApplicationDependencies = async (request: NextRequest) => {
  const appId = request.nextUrl.searchParams.get('appId');
  const version = request.nextUrl.searchParams.get('version');

  if (!appId || !version || isNaN(parseInt(appId))) {
    return NextResponse.json(
      { error: 'appId and version params are required, appId must be a number' },
      { status: 400 },
    );
  }

  const rawAppVersion = await prisma.version.findFirst({
    where: {
      appId,
      value: version,
      deleted: false,
    },
    select: {
      dependencies: {
        where: { deleted: false },
        select: {
          dependencyAppVersion: {
            select: {
              value: true,
              appId: true,
              app: true,
            },
          },
        },
      },
    },
  });

  if (!rawAppVersion) {
    return NextResponse.json({ error: 'app version not found' }, { status: 404 });
  }

  const dependencies = rawAppVersion.dependencies.map((dep) => ({
    appId: dep.dependencyAppVersion.appId,
    appName: dep.dependencyAppVersion.app.name,
    version: dep.dependencyAppVersion.value,
  }));

  return NextResponse.json(dependencies);
};
