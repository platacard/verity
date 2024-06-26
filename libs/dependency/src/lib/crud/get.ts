import { NextResponse } from 'next/server';

import { Dependency } from '@prisma/client';

import { prisma } from '@verity/prisma';

export const getVersionDependencies = async (versionId: number) => {
  try {
    const dependencies: Dependency[] =
      (await prisma.dependency.findMany({
        where: { dependantAppVersionId: versionId, deleted: false },
      })) ?? [];

    return NextResponse.json(dependencies);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
