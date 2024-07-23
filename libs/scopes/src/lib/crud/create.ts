import { NextResponse } from 'next/server';

import { Scope, User } from '@prisma/client';
import { z } from 'zod';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

import { createScopeSchema } from './schemas';

export const createScope = async (data: z.infer<typeof createScopeSchema>, user: User) => {
  let parsedData: z.infer<typeof createScopeSchema>;

  try {
    parsedData = createScopeSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const scope: Scope = await prisma.scope.create({
      data: {
        name: parsedData.name,
        description: parsedData.description || null,
      },
    });

    await logEvent({
      action: AuditLogEventType.SCOPE_CREATE,
      timestamp: scope.createdAt,
      userId: user.id,
      scopeId: scope.id,
    });

    return NextResponse.json(scope);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
