import { prisma } from '@verity/prisma';

import { AuditLogEvent } from './models/AuditLogEvent';

export const logEvent = async (event: AuditLogEvent) => {
  const { userId, timestamp, action, appId, versionId, dependencyId } = event;

  try {
    await prisma.auditLogs.create({
      data: {
        timestamp,
        action,
        userId,
        appId,
        versionId,
        dependencyId,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
