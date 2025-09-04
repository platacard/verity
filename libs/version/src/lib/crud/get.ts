import { NextResponse } from 'next/server';

import { Version } from '@prisma/client';

import { UserWithRole } from '@verity/auth';
import { prisma } from '@verity/prisma';
import { DefaultUserRoles } from '@verity/user-roles';
import { getUserScopeIds } from '@verity/utils';

export const getVersionsByAppId = async (appId: string, user: UserWithRole) => {
  try {
    const isAdmin = user.roleId === DefaultUserRoles.ADMIN;
    const userScopeIds = getUserScopeIds(user);

    // Ensure app belongs to an allowed scope
    const app = await prisma.app.findUnique({ where: { id: appId }, select: { scopeId: true } });
    if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    if (!isAdmin && !userScopeIds.includes(app.scopeId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const versions: Version[] =
      (await prisma.version.findMany({
        where: { appId, deleted: false },
      })) ?? [];

    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
