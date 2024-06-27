import { NextRequest } from 'next/server';

import { User } from '@prisma/client';

import { withAuth } from '@verity/auth/server';
import { DynamicRouteData } from '@verity/shared/server';
import { createVersion } from '@verity/version';

export const POST = withAuth(
  async (request: NextRequest, dynamicData: DynamicRouteData, user: User) => {
    const data = await request.json();

    return createVersion(data, user);
  },
  true,
);
