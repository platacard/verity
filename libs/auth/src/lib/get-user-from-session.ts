import { Session } from 'next-auth';

import { prisma } from '@verity/prisma';

import { UserWithRole } from './models/UserWithRole';

export const getUserFromSession = async (session: Session): Promise<UserWithRole | null> => {
  const userEmail = session.user?.email;

  if (!userEmail) return null;

  return prisma.user.findUnique({
    where: { email: userEmail },
    include: { role: true },
  });
};
