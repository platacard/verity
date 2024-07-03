import { NextResponse } from 'next/server';

import { UserWithRole } from '@verity/auth';
import { prisma } from '@verity/prisma';

export const getUsers = async () => {
  try {
    const users: UserWithRole[] = await prisma.user.findMany({
      include: {
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
