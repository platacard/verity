import { NextRequest } from 'next/server';

import { withAuth } from '@verity/auth/server';
import { createVersion } from '@verity/version';

export const POST = withAuth(async (request: NextRequest) => {
  const data = await request.json();

  return createVersion(data);
}, true);
