import { z } from 'zod';

export const createDependencySchema = z.object({
  dependantAppVersionId: z.string().min(1, 'dependantAppVersionId is required'),
  dependencyAppVersionId: z.string().min(1, 'dependencyAppVersionId is required'),
});
