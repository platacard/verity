import { NextRequest } from 'next/server';

import { getVersionDependencies } from '@verity/dependency';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return getVersionDependencies(parseInt(params.id));
}
