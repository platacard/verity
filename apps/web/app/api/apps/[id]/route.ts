import { NextRequest } from 'next/server';

import { getAppById, markAppAsDeleted } from '@verity/app';
import type { UserWithRole } from '@verity/auth';
import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(
  async (_req: NextRequest, routeData: DynamicRouteData, user: UserWithRole) => {
    return getAppById(routeData.params.id, user);
  },
  true,
);

export const DELETE = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: UserWithRole) => {
    return markAppAsDeleted(routeData.params.id, user);
  },
);
