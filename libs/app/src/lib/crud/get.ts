import { NextResponse } from 'next/server';

import { App } from '@prisma/client';

import { prisma } from '@verity/prisma';

import { AppWithVersionsAndDeps } from '../models';

export const getApps = async () => {
  const apps: AppWithVersionsAndDeps[] =
    (await prisma.app.findMany({
      include: {
        versions: {
          include: {
            dependencies: {
              include: {
                dependencyAppVersion: true,
              },
            },
          },
        },
      },
    })) ?? [];

  return NextResponse.json(apps);
};

export const getAppById = async (id: string) => {
  const app: App | null = await prisma.app.findUnique({
    where: { id },
  });

  if (!app) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 });
  }

  return NextResponse.json(app);
};
