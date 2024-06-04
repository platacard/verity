import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

import { App, RawApp } from '../models';

export const getApps = async () => {
  const rawApps: RawApp[] = (await prisma.app.findMany()) ?? [];

  return NextResponse.json(rawApps.map((rawApp) => new App(rawApp)));
};

export const getAppById = async (id: string) => {
  const rawApp: RawApp | null = await prisma.app.findUnique({
    where: { id },
  });

  if (!rawApp) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 });
  }

  return NextResponse.json(new App(rawApp));
};
