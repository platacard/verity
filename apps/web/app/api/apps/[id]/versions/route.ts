import { NextRequest } from 'next/server';

import type { UserWithRole } from '@verity/auth';
import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';
import { getVersionsByAppId } from '@verity/version';

export const GET = withAuth(
  async (_req: NextRequest, routeData: DynamicRouteData, user: UserWithRole) => {
    return getVersionsByAppId(routeData.params.id, user);
  },
  true,
);
