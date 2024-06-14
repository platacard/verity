import { NextRequest } from 'next/server';

import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';
import { deleteVersion, markVersionAsBuilt } from '@verity/version';

export const PUT = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  const data = await request.json();

  return markVersionAsBuilt(parseInt(routeData.params.id), data);
}, true);

export const DELETE = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return deleteVersion(parseInt(routeData.params.id));
});
