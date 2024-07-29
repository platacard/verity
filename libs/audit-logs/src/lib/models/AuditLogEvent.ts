export enum AuditLogEventType {
  APPLICATION_CREATE = 'APPLICATION_CREATE',
  APPLICATION_DELETE = 'APPLICATION_DELETE',
  VERSION_CREATE = 'VERSION_CREATE',
  VERSION_DELETE = 'VERSION_DELETE',
  VERSION_BUILD = 'VERSION_BUILD',
  DEPENDENCY_CREATE = 'DEPENDENCY_CREATE',
  DEPENDENCY_DELETE = 'DEPENDENCY_DELETE',
  SCOPE_CREATE = 'SCOPE_CREATE',
  SCOPE_DELETE = 'SCOPE_DELETE',
  SCOPE_USER_ADD = 'SCOPE_USER_ADD',
  SCOPE_USER_REMOVE = 'SCOPE_USER_REMOVE',
}

export interface AuditLogEvent {
  readonly action: AuditLogEventType;
  readonly timestamp: Date;
  readonly userId: string;
  readonly appId?: string;
  readonly versionId?: string;
  readonly dependencyId?: string;
  readonly scopeId?: string;
  readonly targetUserId?: string; // Used for SCOPE_USER_ADD and SCOPE_USER_DELETE
}
