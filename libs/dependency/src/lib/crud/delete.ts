import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const markDependencyAsDeleted = async (id: number) => {
  try {
    await prisma.dependency.update({
      where: { id },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
