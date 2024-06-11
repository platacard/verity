'use client';

import { Toaster } from '@verity/ui/toaster';

import AppsList from './apps-list';

export function AdminPanel() {
  return (
    <div className="h-full w-full py-2">
      <AppsList />
      <Toaster />
    </div>
  );
}
