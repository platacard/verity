import { NextRequest } from 'next/server';

import { deleteApp, getAppById } from '@verity/app';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return getAppById(params.id);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return deleteApp(params.id);
}
