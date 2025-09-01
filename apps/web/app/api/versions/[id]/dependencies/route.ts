import { NextRequest } from 'next/server';

import type { UserWithRole } from '@verity/auth';
import { withAuth } from '@verity/auth/server';
import { getVersionDependencies } from '@verity/dependency';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(
  async (_req: NextRequest, routeData: DynamicRouteData, user: UserWithRole) => {
    return getVersionDependencies(routeData.params.id, user);
  },
);
