import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { markDependencyAsDeleted } from '@verity/dependency';
import { DynamicRouteData } from '@verity/shared/server';

export const DELETE = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    return markDependencyAsDeleted(routeData.params.id, user);
  },
);
