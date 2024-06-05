import { NextRequest } from 'next/server';

import { createApp, getApps } from '@verity/app';

export async function GET() {
  return getApps();
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  return createApp(data);
}
