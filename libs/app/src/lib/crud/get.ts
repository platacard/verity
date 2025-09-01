import { NextResponse } from 'next/server';

import { App } from '@prisma/client';

import { UserWithRole } from '@verity/auth';
import { prisma } from '@verity/prisma';
import { DefaultUserRoles } from '@verity/user-roles';
import { getUserScopeIds } from '@verity/utils';

import { AppWithVersionsAndDeps } from '../models';

export const getApps = async (user: UserWithRole) => {
  const isAdmin = user.roleId === DefaultUserRoles.ADMIN;
  const userScopeIds = getUserScopeIds(user);

  const apps: AppWithVersionsAndDeps[] =
    (await prisma.app.findMany({
      where: {
        deleted: false,
        ...(isAdmin ? {} : { scopeId: { in: userScopeIds } }),
      },
      include: {
        versions: {
          where: { deleted: false },
          include: {
            dependencies: {
              where: { deleted: false },
              include: {
                dependencyAppVersion: {
                  include: {
                    app: true,
                  },
                },
              },
            },
          },
        },
        scope: true,
      },
    })) ?? [];

  return NextResponse.json(apps);
};

export const getAppById = async (id: string, user: UserWithRole) => {
  const isAdmin = user.roleId === DefaultUserRoles.ADMIN;
  const userScopeIds = getUserScopeIds(user);

  const app: App | null = await prisma.app.findUnique({
    where: { id },
  });

  if (!app) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 });
  }

  if (!isAdmin && !userScopeIds.includes(app.scopeId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(app);
};
