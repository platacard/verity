import { NextRequest } from 'next/server';

import { deleteDependency } from '@verity/dependency';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return deleteDependency(parseInt(params.id));
}
