import { NextResponse } from 'next/server';

import { User, Version } from '@prisma/client';
import { z } from 'zod';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

import { createVersionSchema } from './schemas';

export const createVersion = async (data: z.infer<typeof createVersionSchema>, user: User) => {
  let parsedData: z.infer<typeof createVersionSchema>;

  try {
    parsedData = createVersionSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const version: Version = await prisma.version.create({
      data: {
        appId: parsedData.appId,
        value: parsedData.value,
        builtAt: parsedData.builtAt ?? null,
      },
    });

    await logEvent({
      action: AuditLogEventType.VERSION_CREATE,
      timestamp: version.createdAt,
      userId: user.id,
      appId: version.appId,
      versionId: version.id,
    });

    return NextResponse.json(version);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
