import { AuditLogs, Header } from '@verity/admin-panel';
import { requireAdmin } from '@verity/auth/server';

export default async function AuditLogsPage() {
  const user = await requireAdmin();

  return (
    <>
      <Header roleId={user?.roleId ?? undefined} />
      <AuditLogs />
    </>
  );
}
