import { z } from 'zod';

export const createAppSchema = z.object({
  id: z.string().min(1, 'Id is required'),
});
