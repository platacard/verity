import { redirect } from 'next/navigation';

import { DefaultUserRoles } from '@verity/user-roles';

import { auth } from './auth';
import { getUserFromSession } from './get-user-from-session';

export const requireSession = async () => {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');
  return session;
};

export const requireUser = async () => {
  const session = await requireSession();
  const user = await getUserFromSession(session);
  if (!user) redirect('/api/auth/signin');
  return user;
};

export const requireAdmin = async () => {
  const user = await requireUser();
  if (user.roleId !== DefaultUserRoles.ADMIN) redirect('/forbidden');
  return user;
};
