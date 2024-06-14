import { NextRequest } from 'next/server';

import { createApp, getApps } from '@verity/app';
import { withAuth } from '@verity/auth/server';

export const GET = withAuth(async () => {
  return getApps();
});

export const POST = withAuth(async (request: NextRequest) => {
  const data = await request.json();

  return createApp(data);
}, true);
