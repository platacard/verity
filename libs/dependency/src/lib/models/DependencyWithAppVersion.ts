import { Prisma } from '@prisma/client';

export type DependencyWithAppVersion = Prisma.DependencyGetPayload<{
  include: {
    dependencyAppVersion: {
      include: {
        app: true;
      };
    };
  };
}>;
