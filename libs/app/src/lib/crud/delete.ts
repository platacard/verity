import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const deleteApp = async (id: string) => {
  try {
    await prisma.app.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
