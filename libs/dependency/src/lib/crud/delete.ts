import { NextResponse } from 'next/server';

import { User } from '@prisma/client';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

export const markDependencyAsDeleted = async (id: number, user: User) => {
  try {
    const updDependency = await prisma.dependency.update({
      where: { id },
      data: { deleted: true },
      include: {
        dependantAppVersion: {
          include: {
            app: true,
          },
        },
      },
    });

    await logEvent({
      action: AuditLogEventType.DEPENDENCY_DELETE,
      timestamp: new Date(),
      userId: user.id,
      appId: updDependency.dependantAppVersion.appId,
      versionId: updDependency.dependantAppVersionId,
      dependencyId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
