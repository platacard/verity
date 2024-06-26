import { NextResponse } from 'next/server';

import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { DependencyWithAppVersion } from '../models';
import { createDependencySchema } from './schemas';

export const createDependency = async (data: z.infer<typeof createDependencySchema>) => {
  let parsedData: z.infer<typeof createDependencySchema>;

  try {
    parsedData = createDependencySchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const dependency: DependencyWithAppVersion = await prisma.dependency.create({
      data: {
        dependantAppVersionId: parsedData.dependantAppVersionId,
        dependencyAppVersionId: parsedData.dependencyAppVersionId,
      },
      include: {
        dependencyAppVersion: {
          include: {
            app: true,
          },
        },
      },
    });

    return NextResponse.json(dependency);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
