import { NextResponse } from 'next/server';

import { UserWithRole } from '@verity/auth';
import { prisma } from '@verity/prisma';
import { DefaultUserRoles } from '@verity/user-roles';
import { getUserScopeIds } from '@verity/utils';

import { ScopeExtended } from '../models';

export const getScopes = async (user: UserWithRole) => {
  const isAdmin = user.roleId === DefaultUserRoles.ADMIN;
  const userScopeIds = getUserScopeIds(user);

  const scopes: ScopeExtended[] =
    (await prisma.scope.findMany({
      where: {
        deleted: false,
        ...(isAdmin ? {} : { id: { in: userScopeIds } }),
      },
      include: {
        users: true,
        apps: { where: { deleted: false } },
        versions: { where: { deleted: false } },
        dependencies: { where: { deleted: false } },
      },
    })) ?? [];

  return NextResponse.json(scopes);
};
