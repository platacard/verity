import 'next-auth';
import 'next-auth/jwt';

import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { User } from '@prisma/client';

import { prisma } from '@verity/prisma';
import { DynamicRouteData } from '@verity/shared/server';
import { DefaultUserRoles } from '@verity/user-roles';
import { parseJwt } from '@verity/utils';

import { getUserFromSession } from './get-user-from-session';

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      groups?: string[];
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
  events: {
    /**
     * Set the role of the first user in the database to admin,
     * and all subsequent users to regular user.
     * @param user
     */
    async createUser({ user }) {
      const usersCount = await prisma.user.count();
      const roleId = usersCount === 1 ? DefaultUserRoles.ADMIN : DefaultUserRoles.USER;

      await prisma.user.update({
        where: { id: user.id },
        data: { roleId },
      });
    },
  },
  callbacks: {
    jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      if (token.idToken) {
        const userData = parseJwt<{ groups: string[] }>(token.idToken);

        if (userData?.groups) {
          session.user.groups = userData.groups;
        }
      }
      return session;
    },
  },
});

export const withAuth = (
  handler: (
    req: NextRequest,
    dynamicData: DynamicRouteData,
    user: User,
  ) => Promise<void | NextResponse>,
  allowTokenAuth = false,
) => {
  return async (req: NextRequest, dynamicData: DynamicRouteData) => {
    const session = await auth();
    const user = session && (await getUserFromSession(session));

    if (user) return handler(req, dynamicData, user);

    if (allowTokenAuth) {
      const token = req.headers.get('Authorization');
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        const user = await prisma.user.findUnique({ where: { ciToken: token } });

        if (user) return handler(req, dynamicData, user);
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  };
};
