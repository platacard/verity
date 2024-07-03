import { z } from 'zod';

export const setUserRoleSchema = z.object({
  roleId: z.string().min(1, 'roleId is required'),
});
