import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const markAppAsDeleted = async (id: number) => {
  try {
    await prisma.app.update({
      where: { id },
      data: { deleted: true },
    });

    await prisma.version.updateMany({
      where: { appId: id },
      data: { deleted: true },
    });

    const affectedVersions = await prisma.version.findMany({
      where: { appId: id },
      select: { id: true },
    });
    const affectedVersionIds = affectedVersions.map((version) => version.id);

    await prisma.dependency.updateMany({
      where: {
        OR: [
          { dependantAppVersionId: { in: affectedVersionIds } },
          { dependencyAppVersionId: { in: affectedVersionIds } },
        ],
      },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
