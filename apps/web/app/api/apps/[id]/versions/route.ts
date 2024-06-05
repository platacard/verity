import { NextRequest } from 'next/server';

import { getVersionsByAppId } from '@verity/version';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return getVersionsByAppId(params.id);
}
