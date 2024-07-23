import { redirect } from 'next/navigation';

import { ScopesComponent } from '@verity/admin-panel';
import { auth } from '@verity/auth/server';

export default async function ScopesPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  return <ScopesComponent />;
}