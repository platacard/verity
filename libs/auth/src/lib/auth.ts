import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { User } from '@prisma/client';

import { prisma } from '@verity/prisma';
import { DynamicRouteData } from '@verity/shared/server';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
});

export const withAuth = (
  handler: (req: NextRequest, dynamicData: DynamicRouteData, user: User) => Promise<unknown>,
  allowTokenAuth = false,
) => {
  return async (req: NextRequest, dynamicData: DynamicRouteData) => {
    const session = await auth();

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });

      if (user) return handler(req, dynamicData, user);
    }

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
