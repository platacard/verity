import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

import { ScopeExtended } from '../models';

export const getScopes = async () => {
  const scopes: ScopeExtended[] =
    (await prisma.scope.findMany({
      where: {
        deleted: false,
      },
      include: {
        users: true,
        apps: true,
        versions: true,
        dependencies: true,
      },
    })) ?? [];

  return NextResponse.json(scopes);
};
