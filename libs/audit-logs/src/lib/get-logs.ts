import { prisma } from '@verity/prisma';

export const getLogs = async () => {
  try {
    return await prisma.auditLogs.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        user: true,
        app: true,
        version: true,
        dependency: true,
        scope: true,
      },
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
