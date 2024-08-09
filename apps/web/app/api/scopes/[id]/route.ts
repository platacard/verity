import { NextRequest, NextResponse } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { markScopeAsDeleted } from '@verity/scopes';
import { DynamicRouteData } from '@verity/shared/server';
import { DefaultUserRoles } from '@verity/user-roles';

export const DELETE = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    if (user.roleId !== DefaultUserRoles.ADMIN) {
      return NextResponse.json({ error: 'access denied' }, { status: 403 });
    }

    return markScopeAsDeleted(routeData.params.id, user);
  },
);
