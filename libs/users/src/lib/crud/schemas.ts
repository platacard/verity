import { z } from 'zod';

export const setUserRoleSchema = z.object({
  roleId: z.string().min(1, 'roleId is required'),
});

export const createUserSchema = z.object({
  email: z.string().email('email is invalid'),
  name: z.string().min(1, 'name is required'),
  roleId: z.string().min(1, 'roleId is required'),
});
