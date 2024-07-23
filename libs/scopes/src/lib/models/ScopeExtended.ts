import { Prisma } from '@prisma/client';

export type ScopeExtended = Prisma.ScopeGetPayload<{
  include: {
    users: true;
    apps: true;
    versions: true;
    dependencies: true;
  };
}>;
