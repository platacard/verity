import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const deleteVersion = async (id: number) => {
  try {
    await prisma.version.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
