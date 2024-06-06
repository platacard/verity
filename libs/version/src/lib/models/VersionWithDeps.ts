import { Prisma } from '@prisma/client';

export type VersionWithDeps = Prisma.VersionGetPayload<{
  include: {
    dependencies: {
      include: {
        dependencyAppVersion: true;
      };
    };
  };
}>;
