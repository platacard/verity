import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { getAppById, markAppAsDeleted } from '@verity/app';
import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(async (request: NextRequest, routeData: DynamicRouteData) => {
  return getAppById(routeData.params.id);
}, true);

export const DELETE = withAuth(
  async (request: NextRequest, routeData: DynamicRouteData, user: User) => {
    return markAppAsDeleted(routeData.params.id, user);
  },
);
