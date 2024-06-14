import { NextRequest } from 'next/server';

import { deleteApp, getAppById } from '@verity/app';
import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return getAppById(routeData.params.id);
});

export const DELETE = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return deleteApp(routeData.params.id);
});
