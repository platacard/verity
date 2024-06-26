import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const markVersionAsDeleted = async (id: number) => {
  try {
    await prisma.version.update({
      where: { id },
      data: { deleted: true },
    });

    await prisma.dependency.updateMany({
      where: {
        OR: [{ dependantAppVersionId: id }, { dependencyAppVersionId: id }],
      },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
