import { NextResponse } from 'next/server';

import { Version } from '@prisma/client';

import { prisma } from '@verity/prisma';

export const getVersionsByAppId = async (appId: number) => {
  try {
    const versions: Version[] =
      (await prisma.version.findMany({
        where: { appId, deleted: false },
      })) ?? [];

    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
