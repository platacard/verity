import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from '@verity/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
});
