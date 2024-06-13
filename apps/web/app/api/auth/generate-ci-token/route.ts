import { generateCiToken, withAuth } from '@verity/auth/server';

export const GET = withAuth(async () => {
  return generateCiToken();
});
