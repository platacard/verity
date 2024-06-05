import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const deleteDependency = async (id: number) => {
  try {
    await prisma.dependency.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
