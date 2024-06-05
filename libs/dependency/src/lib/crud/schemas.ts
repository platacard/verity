import { z } from 'zod';

export const createDependencySchema = z.object({
  dependantAppVersionId: z.number().min(1, 'dependantAppVersionId is required'),
  dependencyAppVersionId: z.number().min(1, 'dependencyAppVersionId is required'),
});
