import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from '@verity/prisma';
import { DynamicRouteData } from '@verity/shared/server';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
});

export const withAuth = (
  handler: (req: NextRequest, dynamicData: DynamicRouteData) => Promise<unknown>,
  allowTokenAuth = false,
) => {
  return async (req: NextRequest, dynamicData: DynamicRouteData) => {
    const session = await auth();

    if (session) return handler(req, dynamicData);

    if (allowTokenAuth) {
      const token = req.headers.get('Authorization');
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        const user = await prisma.user.findUnique({ where: { ciToken: token } });

        if (user) return handler(req, dynamicData);
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  };
};
