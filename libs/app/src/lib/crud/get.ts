import { NextResponse } from 'next/server';

import { App } from '@prisma/client';

import { prisma } from '@verity/prisma';

export const getApps = async () => {
  const apps: App[] = (await prisma.app.findMany()) ?? [];

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
