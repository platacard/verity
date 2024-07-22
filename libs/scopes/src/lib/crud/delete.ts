import { NextResponse } from 'next/server';

import { User } from '@prisma/client';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

export const markScopeAsDeleted = async (id: number, user: User) => {
  try {
    // Marks the scope as deleted

    await prisma.scope.update({
      where: { id },
      data: { deleted: true },
    });

    await logEvent({
      action: AuditLogEventType.SCOPE_DELETE,
      timestamp: new Date(),
      userId: user.id,
      scopeId: id,
    });

    // Marks all Apps associated with the scope as deleted

    const affectedApps = await prisma.app.findMany({
      where: { scopeId: id },
      select: { id: true },
    });
    const affectedAppIds = affectedApps.map(({ id }) => id);

    await prisma.app.updateMany({
      where: { scopeId: id },
      data: { deleted: true },
    });

    for (const appId of affectedAppIds) {
      await logEvent({
        action: AuditLogEventType.APPLICATION_DELETE,
        timestamp: new Date(),
        userId: user.id,
        scopeId: id,
        appId,
      });
    }

    // Marks all Versions associated with the scope as deleted

    const affectedVersions = await prisma.version.findMany({
      where: { scopeId: id },
      select: { id: true, appId: true },
    });

    await prisma.version.updateMany({
      where: { scopeId: id },
      data: { deleted: true },
    });

    for (const version of affectedVersions) {
      await logEvent({
        action: AuditLogEventType.VERSION_DELETE,
        timestamp: new Date(),
        userId: user.id,
        scopeId: id,
        appId: version.appId,
        versionId: version.id,
      });
    }

    // Marks all Dependencies associated with the scope as deleted

    const affectedDependencies = await prisma.dependency.findMany({
      where: { scopeId: id },
      select: {
        id: true,
        dependantAppVersion: {
          select: { id: true, appId: true },
        },
      },
    });

    await prisma.dependency.updateMany({
      where: { scopeId: id },
      data: { deleted: true },
    });

    for (const dependency of affectedDependencies) {
      await logEvent({
        action: AuditLogEventType.DEPENDENCY_DELETE,
        timestamp: new Date(),
        userId: user.id,
        scopeId: id,
        appId: dependency.dependantAppVersion.appId,
        versionId: dependency.dependantAppVersion.id,
        dependencyId: dependency.id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
