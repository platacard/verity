import { redirect } from 'next/navigation';

import { Header, UsersList } from '@verity/admin-panel';
import { auth, getUserFromSession } from '@verity/auth/server';
import { DefaultUserRoles } from '@verity/user-roles';

export default async function UsersPage() {
  const session = await auth();

  if (!session) redirect('/api/auth/signin');

  const user = await getUserFromSession(session);

  if (user?.roleId === DefaultUserRoles.ADMIN) {
    return (
      <>
        <Header />
        <UsersList currentUser={user} />
      </>
    );
  } else {
    return <p>You do not have permissions to see this page</p>;
  }
}
