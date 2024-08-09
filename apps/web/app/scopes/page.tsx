import { redirect } from 'next/navigation';

import { Header, ScopesComponent } from '@verity/admin-panel';
import { auth, getUserFromSession } from '@verity/auth/server';
import { DefaultUserRoles } from '@verity/user-roles';

export default async function ScopesPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  const user = await getUserFromSession(session);

  return (
    <>
      <Header />
      <ScopesComponent userRole={user?.role?.id as DefaultUserRoles} />
    </>
  );
}
