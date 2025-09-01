import { AdminPanel, Header } from '@verity/admin-panel';
import { requireUser } from '@verity/auth/server';

export default async function Component() {
  const user = await requireUser();

  return (
    <>
      <Header roleId={user?.roleId ?? undefined} />
      <AdminPanel />
    </>
  );
}
