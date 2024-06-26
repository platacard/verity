import { NextRequest } from 'next/server';

import { withAuth } from '@verity/auth/server';
import { markDependencyAsDeleted } from '@verity/dependency';
import { DynamicRouteData } from '@verity/shared/server';

export const DELETE = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return markDependencyAsDeleted(parseInt(routeData.params.id));
});
