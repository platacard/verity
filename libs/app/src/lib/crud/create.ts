import { NextResponse } from 'next/server';

import { App, User } from '@prisma/client';
import { z } from 'zod';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

import { createAppSchema } from './schemas';

export const createApp = async (data: z.infer<typeof createAppSchema>, user: User) => {
  let parsedData: z.infer<typeof createAppSchema>;

  try {
    parsedData = createAppSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const app: App = await prisma.app.create({
      data: {
        name: parsedData.name,
      },
    });

    await logEvent({
      action: AuditLogEventType.APPLICATION_CREATE,
      timestamp: app.createdAt,
      userId: user.id,
      appId: app.id,
    });

    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
