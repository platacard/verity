import { NextResponse } from 'next/server';

import { User } from '@prisma/client';
import { z } from 'zod';

import { AuditLogEventType, logEvent } from '@verity/audit-logs';
import { prisma } from '@verity/prisma';

import { DependencyWithAppVersion } from '../models';
import { createDependencySchema } from './schemas';

export const createDependency = async (
  data: z.infer<typeof createDependencySchema>,
  user: User,
) => {
  let parsedData: z.infer<typeof createDependencySchema>;

  try {
    parsedData = createDependencySchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const dependantAppVersionWithScopeId = await prisma.version.findUnique({
      where: {
        id: parsedData.dependantAppVersionId,
      },
      select: {
        scopeId: true,
      },
    });

    const dependencyAppVersionWithScopeId = await prisma.version.findUnique({
      where: {
        id: parsedData.dependencyAppVersionId,
      },
      select: {
        scopeId: true,
      },
    });

    if (!dependantAppVersionWithScopeId) {
      return NextResponse.json({ error: 'Dependant app version not found' }, { status: 404 });
    }

    if (!dependencyAppVersionWithScopeId) {
      return NextResponse.json({ error: 'Dependency app version not found' }, { status: 404 });
    }

    if (dependantAppVersionWithScopeId.scopeId !== dependencyAppVersionWithScopeId.scopeId) {
      return NextResponse.json(
        { error: 'Dependant and dependency app versions are not in the same scope' },
        { status: 400 },
      );
    }

    const dependency: DependencyWithAppVersion = await prisma.dependency.create({
      data: {
        dependantAppVersionId: parsedData.dependantAppVersionId,
        dependencyAppVersionId: parsedData.dependencyAppVersionId,
        scopeId: dependantAppVersionWithScopeId.scopeId,
      },
      include: {
        dependantAppVersion: {
          include: {
            app: true,
          },
        },
        dependencyAppVersion: {
          include: {
            app: true,
          },
        },
      },
    });

    await logEvent({
      action: AuditLogEventType.DEPENDENCY_CREATE,
      timestamp: dependency.createdAt,
      userId: user.id,
      scopeId: dependency.scopeId,
      appId: dependency.dependantAppVersion.appId,
      versionId: dependency.dependantAppVersionId,
      dependencyId: dependency.id,
    });

    return NextResponse.json(dependency);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
