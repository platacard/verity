import { NextRequest } from 'next/server';

import type { UserWithRole } from '@verity/auth';
import { withAuth } from '@verity/auth/server';
import { addUserToScope, createScope, getScopes, removeUserFromScope } from '@verity/scopes';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(async (_req, _d, user: UserWithRole) => {
  return getScopes(user);
});

export const POST = withAuth(
  async (request: NextRequest, dynamicData: DynamicRouteData, user: UserWithRole) => {
    const data = await request.json();

    return createScope(data, user);
  },
);

export const PUT = withAuth(
  async (request: NextRequest, _d: DynamicRouteData, user: UserWithRole) => {
    const data = await request.json();
    return addUserToScope(data, user);
  },
);

export const PATCH = withAuth(
  async (request: NextRequest, _d: DynamicRouteData, user: UserWithRole) => {
    const data = await request.json();
    return removeUserFromScope(data, user);
  },
);
