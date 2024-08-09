import { NextResponse } from 'next/server';

import { User } from '@prisma/client';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

export const markAppAsDeleted = async (id: string, user: User) => {
  try {
    const updApp = await prisma.app.update({
      where: { id },
      data: { deleted: true },
    });

    await logEvent({
      action: AuditLogEventType.APPLICATION_DELETE,
      timestamp: new Date(),
      scopeId: updApp.scopeId,
      userId: user.id,
      appId: id,
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

    for (const versionId of affectedVersionIds) {
      await logEvent({
        action: AuditLogEventType.VERSION_DELETE,
        timestamp: new Date(),
        userId: user.id,
        scopeId: updApp.scopeId,
        appId: id,
        versionId,
      });
    }

    await prisma.dependency.updateMany({
      where: {
        OR: [
          { dependantAppVersionId: { in: affectedVersionIds } },
          { dependencyAppVersionId: { in: affectedVersionIds } },
        ],
      },
      data: { deleted: true },
    });

    const affectedDependencies = await prisma.dependency.findMany({
      where: {
        OR: [
          { dependantAppVersionId: { in: affectedVersionIds } },
          { dependencyAppVersionId: { in: affectedVersionIds } },
        ],
      },
      select: { id: true, dependantAppVersionId: true },
    });

    for (const dependency of affectedDependencies) {
      await logEvent({
        action: AuditLogEventType.DEPENDENCY_DELETE,
        timestamp: new Date(),
        userId: user.id,
        scopeId: updApp.scopeId,
        appId: id,
        versionId: dependency.dependantAppVersionId,
        dependencyId: dependency.id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
