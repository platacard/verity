import { NextResponse } from 'next/server';

import { App } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { createAppSchema } from './schemas';

export const createApp = async (data: z.infer<typeof createAppSchema>) => {
  let parsedData: z.infer<typeof createAppSchema>;

  try {
    parsedData = createAppSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const app: App = await prisma.app.create({
      data: {
        name: parsedData.name,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
