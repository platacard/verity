import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaAdapter } from '@auth/prisma-adapter';
import axios from 'axios';

import { prisma } from '@verity/prisma';
import { DynamicRouteData } from '@verity/shared/server';
import { DefaultUserRoles } from '@verity/user-roles';

import { getUserFromSession } from './get-user-from-session';
// Use Prisma type via include payload to avoid missing export in some setups
import type { UserWithRole } from './models/UserWithRole';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const effectiveRoles = new Set<string>();

        // Read realm roles from id_token (if present)
        const idToken: string | undefined = (account as any)?.id_token;
        if (account) {
          // Persist OIDC metadata for logout handshake
          (token as any).id_token = (account as any)?.id_token;
          (token as any).provider = (account as any)?.provider;
          if ((account as any)?.expires_at)
            (token as any).exp = (account as any)?.expires_at as number;
        }
        if (idToken && idToken.split('.').length === 3) {
          try {
            const payload = JSON.parse(
              Buffer.from(idToken.split('.')[1], 'base64url').toString('utf8'),
            ) as { realm_access?: { roles?: string[] } };
            (payload?.realm_access?.roles ?? []).forEach((r) => effectiveRoles.add(r));
          } catch {
            // ignore decode errors
          }
        }

        // Also read realm roles from access_token (Keycloak usually puts realm_access here)
        const accessToken: string | undefined = (account as any)?.access_token;
        if (accessToken && accessToken.split('.').length === 3) {
          try {
            const payload = JSON.parse(
              Buffer.from(accessToken.split('.')[1], 'base64url').toString('utf8'),
            ) as { realm_access?: { roles?: string[] } };
            (payload?.realm_access?.roles ?? []).forEach((r) => effectiveRoles.add(r));
          } catch {
            // ignore decode errors
          }
        }

        // Fallback: read from userinfo profile if it includes realm_access
        if (profile) {
          const profileAny = profile as unknown as {
            realm_access?: { roles?: string[] };
          };
          (profileAny?.realm_access?.roles ?? []).forEach((r) => effectiveRoles.add(r));
        }

        // Read current role from DB to avoid accidental demotion
        const current = await prisma.user.findUnique({
          where: { id: user.id },
          select: { roleId: true },
        });

        let nextRole: DefaultUserRoles | null = null;

        if (effectiveRoles.has(DefaultUserRoles.ADMIN)) {
          nextRole = DefaultUserRoles.ADMIN;
        } else if (!current?.roleId) {
          // Only default to USER if there is no role yet
          nextRole = DefaultUserRoles.USER;
        }

        if (nextRole && nextRole !== current?.roleId) {
          await prisma.user.update({ where: { id: user.id }, data: { roleId: nextRole } });
        }
      }

      return token;
    },
    async signIn({ user }) {
      // Allow authenticated users; role assignment is handled in jwt callback
      return Boolean(user?.email);
    },
  },
  events: {
    async signOut(event) {
      try {
        const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
        const clientId = process.env.AUTH_KEYCLOAK_ID;

        const provider = (event as any)?.token?.provider;
        const idToken = (event as any)?.token?.id_token as string | undefined;

        if (provider === 'keycloak' && issuer && clientId && idToken) {
          const params = new URLSearchParams();
          params.append('id_token_hint', idToken);
          params.append('client_id', clientId);

          await axios.get(`${issuer}/protocol/openid-connect/logout?${params.toString()}`);
        }
      } catch {
        // ignore errors during logout handshake
      }
    },
  },
});

export const withAuth = (
  handler: (
    req: NextRequest,
    dynamicData: DynamicRouteData,
    user: UserWithRole,
  ) => Promise<void | NextResponse>,
  allowTokenAuth = false,
) => {
  return async (req: NextRequest, dynamicData: DynamicRouteData) => {
    const session = await auth();
    const user = session && (await getUserFromSession(session));

    if (user) return handler(req, dynamicData, user);

    if (allowTokenAuth) {
      const rawAuth = req.headers.get('Authorization');
      if (!rawAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Support both Bearer <token> and plain token for backward compatibility
      const token = rawAuth.startsWith('Bearer ') ? rawAuth.substring('Bearer '.length) : rawAuth;

      try {
        const user = await prisma.user.findUnique({
          where: { ciToken: token },
          include: { role: true, scopes: { select: { id: true } } },
        });

        if (user) return handler(req, dynamicData, user);
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  };
};
