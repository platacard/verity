import { NextResponse } from 'next/server';

import { z } from 'zod';

import { prisma } from '@verity/prisma';

import { setUserRoleSchema } from './schemas';

export const setUserRole = async (userId: string, data: z.infer<typeof setUserRoleSchema>) => {
  let parsedData: z.infer<typeof setUserRoleSchema>;

  try {
    parsedData = setUserRoleSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { roleId: parsedData.roleId },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
