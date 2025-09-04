import { Header, UserProfile } from '@verity/admin-panel';
import { requireUser } from '@verity/auth/server';

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    user && (
      <>
        <Header roleId={user.roleId ?? undefined} />
        <UserProfile user={user} />
      </>
    )
  );
}
