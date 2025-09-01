"use client";

import Link from 'next/link';

import { LogOut, MountainIcon } from 'lucide-react';
import { signOut } from '@verity/auth';

export const Header = ({ roleId }: { roleId?: string }) => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {[
          { href: '/scopes', label: 'Scopes' },
          { href: '/apps', label: 'Applications' },
          { href: '/profile', label: 'Profile' },
          ...(roleId === 'admin'
            ? [
                { href: '/users', label: 'Users' },
                { href: '/audit-logs', label: 'Audit Logs' },
              ]
            : []),
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="/api/auth/signout"
          onClick={(e) => {
            e.preventDefault();
            void signOut({ callbackUrl: '/' });
          }}
          className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1"
          prefetch={false}
        >
          <LogOut className="h-4 w-4" /> Log Out
        </Link>
      </nav>
    </header>
  );
};
