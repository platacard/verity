import { NextResponse } from 'next/server';

import { User } from '@prisma/client';
import { z } from 'zod';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

import { updateScopeUserSchema } from './schemas';

export const addUserToScope = async (data: z.infer<typeof updateScopeUserSchema>, user: User) => {
  let parsedData: z.infer<typeof updateScopeUserSchema>;

  try {
    parsedData = updateScopeUserSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const updScope = await prisma.scope.update({
      where: { id: parsedData.scopeId },
      data: {
        users: { connect: [{ id: parsedData.userId }] },
      },
    });

    await logEvent({
      action: AuditLogEventType.SCOPE_USER_ADD,
      timestamp: new Date(),
      userId: user.id,
      scopeId: updScope.id,
      targetUserId: parsedData.userId,
    });

    return NextResponse.json(updScope);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const removeUserFromScope = async (
  data: z.infer<typeof updateScopeUserSchema>,
  user: User,
) => {
  let parsedData: z.infer<typeof updateScopeUserSchema>;

  try {
    parsedData = updateScopeUserSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const updScope = await prisma.scope.update({
      where: { id: parsedData.scopeId },
      data: {
        users: { disconnect: [{ id: parsedData.userId }] },
      },
    });

    await logEvent({
      action: AuditLogEventType.SCOPE_USER_REMOVE,
      timestamp: new Date(),
      userId: user.id,
      scopeId: updScope.id,
      targetUserId: parsedData.userId,
    });

    return NextResponse.json(updScope);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
