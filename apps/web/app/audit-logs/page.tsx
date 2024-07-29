import { redirect } from 'next/navigation';

import { AuditLogs, Header } from '@verity/admin-panel';
import { auth } from '@verity/auth/server';

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <Header />
      <AuditLogs />
    </>
  );
}
