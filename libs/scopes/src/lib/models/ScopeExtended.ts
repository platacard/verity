import { Prisma } from '@prisma/client';

export type ScopeExtended = Prisma.ScopeGetPayload<{
  include: {
    apps: true;
    versions: true;
    dependencies: true;
    users: true;
  };
}>;
