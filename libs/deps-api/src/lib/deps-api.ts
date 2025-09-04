import { NextRequest, NextResponse } from 'next/server';

import { UserWithRole } from '@verity/auth';
import { prisma } from '@verity/prisma';
import { DefaultUserRoles } from '@verity/user-roles';
import { getUserScopeIds } from '@verity/utils';

export const getApplicationDependencies = async (request: NextRequest, user: UserWithRole) => {
  const appId = request.nextUrl.searchParams.get('appId');
  const version = request.nextUrl.searchParams.get('version');

  if (!appId || !version) {
    return NextResponse.json({ error: 'appId and version params are required' }, { status: 400 });
  }

  const isAdmin = user.roleId === DefaultUserRoles.ADMIN;
  const userScopeIds = getUserScopeIds(user);

  // Ensure app is in user's scopes
  const app = await prisma.app.findUnique({ where: { id: appId }, select: { scopeId: true } });
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 });
  if (!isAdmin && !userScopeIds.includes(app.scopeId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
              app: { select: { id: true, name: true, scopeId: true } },
            },
          },
        },
      },
    },
  });

  if (!rawAppVersion) {
    return NextResponse.json({ error: 'app version not found' }, { status: 404 });
  }

  const dependencies = rawAppVersion.dependencies
    .filter((dep) => (isAdmin ? true : userScopeIds.includes(dep.dependencyAppVersion.app.scopeId)))
    .map((dep) => ({
      appId: dep.dependencyAppVersion.appId,
      appName: dep.dependencyAppVersion.app.name,
      version: dep.dependencyAppVersion.value,
    }));

  return NextResponse.json(dependencies);
};
