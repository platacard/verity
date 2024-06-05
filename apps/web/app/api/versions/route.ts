import { NextRequest } from 'next/server';

import { createVersion } from '@verity/version';

export async function POST(request: NextRequest) {
  const data = await request.json();

  return createVersion(data);
}
