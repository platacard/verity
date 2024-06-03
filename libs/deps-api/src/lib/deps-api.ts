import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const getApplicationDependencies = async (request: NextRequest) => {
  const app = request.nextUrl.searchParams.get('app');
  const version = request.nextUrl.searchParams.get('version');

  if (!app || !version) {
    return new Response('app and version params are required', { status: 400 });
  }

  const rawAppVersion = await prisma.version.findFirst({
    where: {
      appId: app,
      value: version,
    },
    select: {
      dependencies: {
        select: {
          dependencyAppVersion: {
            select: {
              value: true,
              appId: true,
            },
          },
        },
      },
    },
  });

  if (!rawAppVersion) {
    return new Response('app version not found', { status: 404 });
  }

  const dependencies = rawAppVersion.dependencies.reduce(
    (acc, dep) => ({
      ...acc,
      [dep.dependencyAppVersion.appId]: dep.dependencyAppVersion.value,
    }),
    {},
  );

  return NextResponse.json(dependencies);
};
