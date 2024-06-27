import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { createApp, getApps } from '@verity/app';
import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';

export const GET = withAuth(async () => {
  return getApps();
});

export const POST = withAuth(
  async (request: NextRequest, dynamicData: DynamicRouteData, user: User) => {
    const data = await request.json();

    return createApp(data, user);
  },
  true,
);
