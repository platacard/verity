import { z } from 'zod';

export const createScopeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const updateScopeUserSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  scopeId: z.string().min(1, 'scopeId is required'),
});
