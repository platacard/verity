import { NextResponse } from 'next/server';

import { Version } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { markVersionAsBuiltSchema } from './schemas';

export const markVersionAsBuilt = async (
  id: number,
  data: z.infer<typeof markVersionAsBuiltSchema>,
) => {
  let parsedData: z.infer<typeof markVersionAsBuiltSchema>;

  try {
    parsedData = markVersionAsBuiltSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const updVersion: Version = await prisma.version.update({
      where: { id },
      data: { builtAt: parsedData.builtAt },
    });

    return NextResponse.json(updVersion);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
