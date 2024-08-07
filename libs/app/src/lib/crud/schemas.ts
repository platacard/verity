import { z } from 'zod';

export const createAppSchema = z.object({
  name: z.string().min(1, 'name is required'),
  scopeId: z.string().min(1, 'scopeId is required'),
});
