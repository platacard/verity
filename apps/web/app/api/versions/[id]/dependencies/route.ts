import { NextRequest } from 'next/server';

import { withAuth } from '@verity/auth/server';
import { getVersionDependencies } from '@verity/dependency';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return getVersionDependencies(parseInt(routeData.params.id));
});
