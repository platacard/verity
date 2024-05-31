import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Keycloak],
  session: { strategy: 'jwt' },
});
