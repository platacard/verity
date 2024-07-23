import { z } from 'zod';

export const createAppSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  scopeId: z.number().int().positive('Scope id is required'),
});
