import { redirect } from 'next/navigation';

import { UserProfile } from '@verity/admin-panel';
import { auth } from '@verity/auth/server';
import { prisma } from '@verity/prisma';

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  const userEmail = session.user?.email;

  const user =
    userEmail &&
    (await prisma.user.findUnique({
      where: { email: userEmail },
    }));

  return user && <UserProfile user={user} />;
}
