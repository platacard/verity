import { NextResponse } from 'next/server';

import { Dependency } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { createDependencySchema } from './schemas';

export const createDependency = async (data: z.infer<typeof createDependencySchema>) => {
  let parsedData: z.infer<typeof createDependencySchema>;

  try {
    parsedData = createDependencySchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const dependency: Dependency = await prisma.dependency.create({
      data: {
        dependantAppVersionId: parsedData.dependantAppVersionId,
        dependencyAppVersionId: parsedData.dependencyAppVersionId,
      },
    });

    return NextResponse.json(dependency);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
