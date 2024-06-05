import { NextRequest } from 'next/server';

import { deleteVersion, markVersionAsBuilt } from '@verity/version';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json();

  return markVersionAsBuilt(parseInt(params.id), data);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return deleteVersion(parseInt(params.id));
}
