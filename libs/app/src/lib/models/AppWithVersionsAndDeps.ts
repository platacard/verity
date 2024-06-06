import { Prisma } from '@prisma/client';

export type AppWithVersionsAndDeps = Prisma.AppGetPayload<{
  include: {
    versions: {
      include: {
        dependencies: {
          include: {
            dependencyAppVersion: true;
          };
        };
      };
    };
  };
}>;
