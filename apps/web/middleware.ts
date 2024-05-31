import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const middleware = NextAuth({
  providers: [Keycloak],
}).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
