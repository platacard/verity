import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { createDependency } from '@verity/dependency';
import { DynamicRouteData } from '@verity/shared/server';

export const POST = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    const data = await request.json();

    return createDependency(data, user);
  },
);
