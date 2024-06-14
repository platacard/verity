import { NextResponse } from 'next/server';

import { prisma } from '@verity/prisma';

import { auth } from './auth';

export const generateCiToken = async () => {
  try {
    const session = await auth();

    if (!session?.user?.email)
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });

    const updUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { ciToken: generateToken() },
    });

    return NextResponse.json(updUser);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

const generateToken = () =>
  Array(5)
    .fill('')
    .reduce((acc) => acc + Math.random().toString(36).substring(2), '');
