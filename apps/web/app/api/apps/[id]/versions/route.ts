import { NextRequest } from 'next/server';

import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';
import { getVersionsByAppId } from '@verity/version';

export const GET = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return getVersionsByAppId(parseInt(routeData.params.id));
}, true);
