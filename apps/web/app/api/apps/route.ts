import { NextRequest } from 'next/server';

import { createApp, CreateAppDto, getApps } from '@verity/app';

export async function GET() {
  return getApps();
}

export async function POST(request: NextRequest) {
  const data: CreateAppDto = await request.json();

  return createApp(data);
}
