import { NextRequest } from 'next/server';

import { createDependency } from '@verity/dependency';

export async function POST(request: NextRequest) {
  const data = await request.json();

  return createDependency(data);
}
