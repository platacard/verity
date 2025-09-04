import { NextRequest } from 'next/server';

import { UserWithRole } from '@verity/auth';
import { withAuth } from '@verity/auth/server';
import { getApplicationDependencies } from '@verity/deps-api';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(
  async (request: NextRequest, _d: DynamicRouteData, user: UserWithRole) => {
    return getApplicationDependencies(request, user);
  },
  true,
);
