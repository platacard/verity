import { NextResponse } from 'next/server';

import { Version } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { createVersionSchema } from './schemas';

export const createVersion = async (data: z.infer<typeof createVersionSchema>) => {
  let parsedData: z.infer<typeof createVersionSchema>;

  try {
    parsedData = createVersionSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const version: Version = await prisma.version.create({
      data: {
        appId: parsedData.appId,
        value: parsedData.value,
        builtAt: parsedData.builtAt ?? null,
      },
    });

    return NextResponse.json(version);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
