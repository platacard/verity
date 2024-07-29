import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';
import { markVersionAsBuilt, markVersionAsDeleted } from '@verity/version';

export const PUT = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    const data = await request.json();

    return markVersionAsBuilt(routeData.params.id, data, user);
  },
  true,
);

export const DELETE = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    return markVersionAsDeleted(routeData.params.id, user);
  },
);
