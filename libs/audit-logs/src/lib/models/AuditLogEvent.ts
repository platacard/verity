export enum AuditLogEventType {
  APPLICATION_CREATE = 'APPLICATION_CREATE',
  APPLICATION_DELETE = 'APPLICATION_DELETE',
  VERSION_CREATE = 'VERSION_CREATE',
  VERSION_DELETE = 'VERSION_DELETE',
  VERSION_BUILD = 'VERSION_BUILD',
  DEPENDENCY_CREATE = 'DEPENDENCY_CREATE',
  DEPENDENCY_DELETE = 'DEPENDENCY_DELETE',
}

export interface AuditLogEvent {
  readonly action: AuditLogEventType;
  readonly timestamp: Date;
  readonly userId: string;
  readonly appId?: number;
  readonly versionId?: number;
  readonly dependencyId?: number;
}
