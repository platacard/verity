import { NextResponse } from 'next/server';

import { User, Version } from '@prisma/client';
import { z } from 'zod';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

import { markVersionAsBuiltSchema } from './schemas';

export const markVersionAsBuilt = async (
  id: string,
  data: z.infer<typeof markVersionAsBuiltSchema>,
  user: User,
) => {
  let parsedData: z.infer<typeof markVersionAsBuiltSchema>;

  try {
    parsedData = markVersionAsBuiltSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const updVersion: Version = await prisma.version.update({
      where: { id },
      data: { builtAt: parsedData.builtAt },
    });

    await logEvent({
      action: AuditLogEventType.VERSION_BUILD,
      timestamp: new Date(parsedData.builtAt),
      userId: user.id,
      appId: updVersion.appId,
      versionId: updVersion.id,
    });

    return NextResponse.json(updVersion);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
