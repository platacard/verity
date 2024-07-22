import { prisma } from '@verity/prisma';

import { AuditLogEvent } from './models/AuditLogEvent';

export const logEvent = async (event: AuditLogEvent) => {
  const { userId, timestamp, action, scopeId, appId, versionId, dependencyId } = event;

  try {
    await prisma.auditLogs.create({
      data: {
        timestamp,
        action,
        userId,
        appId,
        versionId,
        dependencyId,
        scopeId,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
