import { z } from 'zod';

export const createAppSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});
