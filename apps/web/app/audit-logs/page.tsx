import { redirect } from 'next/navigation';

import { AuditLogs } from '@verity/admin-panel';
import { auth } from '@verity/auth/server';

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  return <AuditLogs />;
}
