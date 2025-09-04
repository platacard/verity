import { Header, ScopesComponent } from '@verity/admin-panel';
import { requireUser } from '@verity/auth/server';
import { DefaultUserRoles } from '@verity/user-roles';

export default async function ScopesPage() {
  const user = await requireUser();

  return (
    <>
      <Header roleId={user?.roleId ?? undefined} />
      <ScopesComponent userRole={user?.role?.id as DefaultUserRoles} />
    </>
  );
}
