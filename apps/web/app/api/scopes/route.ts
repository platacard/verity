import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { createScope, getScopes } from '@verity/scopes';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(async () => {
  return getScopes();
});

export const POST = withAuth(
  async (request: NextRequest, dynamicData: DynamicRouteData, user: User) => {
    const data = await request.json();

    return createScope(data, user);
  },
);
