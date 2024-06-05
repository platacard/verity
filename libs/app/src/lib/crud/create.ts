import { NextResponse } from 'next/server';

import { App } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { createAppSchema } from './schemas';

export const createApp = async (data: z.infer<typeof createAppSchema>) => {
  const { id } = data;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const app: App = await prisma.app.create({
      data: {
        id,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
