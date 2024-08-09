import { NextResponse } from 'next/server';

import { User } from '@prisma/client';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

export const markVersionAsDeleted = async (id: string, user: User) => {
  try {
    const updVersion = await prisma.version.update({
      where: { id },
      data: { deleted: true },
    });

    await logEvent({
      action: AuditLogEventType.VERSION_DELETE,
      timestamp: new Date(),
      userId: user.id,
      scopeId: updVersion.scopeId,
      appId: updVersion.appId,
      versionId: id,
    });

    await prisma.dependency.updateMany({
      where: {
        OR: [{ dependantAppVersionId: id }, { dependencyAppVersionId: id }],
      },
      data: { deleted: true },
    });

    const affectedDependencies = await prisma.dependency.findMany({
      where: {
        OR: [{ dependantAppVersionId: id }, { dependencyAppVersionId: id }],
      },
      include: { dependantAppVersion: true },
    });

    for (const dependency of affectedDependencies) {
      await logEvent({
        action: AuditLogEventType.DEPENDENCY_DELETE,
        timestamp: new Date(),
        userId: user.id,
        scopeId: dependency.scopeId,
        appId: dependency.dependantAppVersion.appId,
        versionId: dependency.dependantAppVersionId,
        dependencyId: dependency.id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
