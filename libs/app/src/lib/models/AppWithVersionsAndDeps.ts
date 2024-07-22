import { Prisma } from '@prisma/client';

export type AppWithVersionsAndDeps = Prisma.AppGetPayload<{
  include: {
    versions: {
      include: {
        dependencies: {
          include: {
            dependencyAppVersion: {
              include: {
                app: true;
              };
            };
          };
        };
      };
    };
    scope: true;
  };
}>;
