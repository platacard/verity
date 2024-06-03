import { NextRequest } from 'next/server';

import { getApplicationDependencies } from '@verity/deps-api';

export async function GET(request: NextRequest) {
  return getApplicationDependencies(request);
}
