import { NextResponse } from 'next/server';

import { Dependency } from '@prisma/client';

import { UserWithRole } from '@verity/auth';
import { prisma } from '@verity/prisma';
import { DefaultUserRoles } from '@verity/user-roles';
import { getUserScopeIds } from '@verity/utils';

export const getVersionDependencies = async (versionId: string, user: UserWithRole) => {
  try {
    const isAdmin = user.roleId === DefaultUserRoles.ADMIN;
    const userScopeIds = getUserScopeIds(user);

    // Load dependant version with scope
    const version = await prisma.version.findUnique({
      where: { id: versionId },
      select: { scopeId: true },
    });
    if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    if (!isAdmin && !userScopeIds.includes(version.scopeId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dependencies: Dependency[] =
      (await prisma.dependency.findMany({
        where: { dependantAppVersionId: versionId, deleted: false },
      })) ?? [];

    return NextResponse.json(dependencies);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
