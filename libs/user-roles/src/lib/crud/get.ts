import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

export const getUserRoles = async () => {
  try {
    const roles = await prisma.userRole.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
