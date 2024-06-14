import { NextRequest } from 'next/server';

import { withAuth } from '@verity/auth/server';
import { createDependency } from '@verity/dependency';

export const POST = withAuth(async (request: NextRequest) => {
  const data = await request.json();

  return createDependency(data);
});
