import { withAuth } from '@verity/auth/server';
import { getUserRoles } from '@verity/user-roles';

export const GET = withAuth(async () => {
  return getUserRoles();
});
