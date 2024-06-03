import { PrismaClient } from '@prisma/client';

import { getQueryParams } from '@verity/utils';

const prisma = new PrismaClient();

export const getAppDepsHandler = async (request: Request) => {
  const { app, version } = getQueryParams(request);

  if (!app || !version) {
    return new Response('app and version params are required', { status: 400 });
  }

  const rawAppVersion = await prisma.appVersion.findFirst({
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

  const dependencies = rawAppVersion.dependencies.reduce((acc, dep) => {
    const appId = dep.dependencyAppVersion?.appId;

    if (!appId) {
      return acc;
    } else {
      return {
        ...acc,
        [appId]: dep.dependencyAppVersion?.value,
      };
    }
  }, {});

  return new Response(JSON.stringify(dependencies), { status: 200 });
};
