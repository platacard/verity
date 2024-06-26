import { z } from 'zod';

export const createVersionSchema = z.object({
  appId: z.number().min(1, 'appId is required'),
  value: z.string().min(1, 'value is required'),
  builtAt: z.string().datetime().optional(),
});

export const markVersionAsBuiltSchema = z.object({
  builtAt: z.string().datetime().min(1),
});
