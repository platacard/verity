import { Prisma } from '@prisma/client';

export type DependencyWithAppVersion = Prisma.DependencyGetPayload<{
  include: {
    dependantAppVersion: {
      include: {
        app: true;
      };
    };
    dependencyAppVersion: {
      include: {
        app: true;
      };
    };
  };
}>;
