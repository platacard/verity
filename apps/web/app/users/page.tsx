import { Header, UsersList } from '@verity/admin-panel';
import { requireAdmin } from '@verity/auth/server';

export default async function UsersPage() {
  const user = await requireAdmin();

  return (
    <>
      <Header roleId={user.roleId ?? undefined} />
      <UsersList currentUser={user} />
    </>
  );
}
