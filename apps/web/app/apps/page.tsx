import { redirect } from 'next/navigation';

import { AdminPanel, Header } from '@verity/admin-panel';
import { auth } from '@verity/auth/server';

export default async function Component() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <Header />
      <AdminPanel />
    </>
  );
}
