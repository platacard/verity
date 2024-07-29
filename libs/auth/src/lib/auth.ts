import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { User } from '@prisma/client';

import { prisma } from '@verity/prisma';
import { DynamicRouteData } from '@verity/shared/server';
import { DefaultUserRoles } from '@verity/user-roles';

import { getUserFromSession } from './get-user-from-session';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, profile }) {
      if (user?.email && profile?.groups) {
        const validUserGroups: DefaultUserRoles[] = [];

        (profile.groups as Array<string>).forEach((group: string) => {
          if (Object.values(DefaultUserRoles).includes(group as DefaultUserRoles)) {
            validUserGroups.push(group as DefaultUserRoles);
          }
        });

        return validUserGroups.length > 0;
      }

      return false;
    },
    async jwt({ token, user, profile }) {
      if (user && profile) {
        const roleId = (profile.groups as Array<string>).includes(DefaultUserRoles.ADMIN)
          ? DefaultUserRoles.ADMIN
          : DefaultUserRoles.USER;

        await prisma.user.update({
          where: { id: user.id },
          data: { roleId },
        });
      }

      return token;
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
