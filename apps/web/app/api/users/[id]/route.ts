import { NextRequest, NextResponse } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';
import { DefaultUserRoles } from '@verity/user-roles';
import { setUserRole } from '@verity/users';

export const PUT = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    if (user.roleId !== DefaultUserRoles.ADMIN) {
      return NextResponse.json({ error: 'access denied' }, { status: 403 });
    }
    const data = await request.json();

    return setUserRole(routeData.params.id, data);
  },
);
