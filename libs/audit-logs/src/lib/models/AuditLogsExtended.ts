import { Prisma } from '@prisma/client';

export type AuditLogsExtended = Prisma.AuditLogsGetPayload<{
  include: {
    user: true;
    app: true;
    version: true;
    dependency: true;
    scope: true;
  };
}>;
