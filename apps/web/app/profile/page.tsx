import { redirect } from 'next/navigation';

import { Header, UserProfile } from '@verity/admin-panel';
import { auth, getUserFromSession } from '@verity/auth/server';

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  const user = await getUserFromSession(session);

  return (
    user && (
      <>
        <Header />
        <UserProfile user={user} />
      </>
    )
  );
}
