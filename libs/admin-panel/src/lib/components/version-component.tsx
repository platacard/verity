'use client';

import { useEffect, useState } from 'react';

import { DependencyWithAppVersion } from '@verity/dependency';
import { Card } from '@verity/ui/card';
import { VersionWithDeps } from '@verity/version';

import { useFetchErrorToast } from '../utils/show-fetch-error';
import { ConfirmationModal } from './confirmation-modal';
import { DependencyModal } from './dependency-modal';

export interface VersionComponentProps {
  readonly version: VersionWithDeps;
  readonly onDelete: (id: number) => void;
}

export function VersionComponent({ version, onDelete }: VersionComponentProps) {
  const [currentVersion, setVersion] = useState<VersionWithDeps>(version);
  const showFetchError = useFetchErrorToast();

  useEffect(() => {
    setVersion(version);
  }, [version]);

  const handleCreateDependency = async (dependencyAppVersionId: number) => {
    try {
      const response = await fetch('api/dependencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dependantAppVersionId: currentVersion.id,
          dependencyAppVersionId,
        }),
      });
      const data: DependencyWithAppVersion = await response.json();

      if (!response.ok) return showFetchError();

      const updVersion: VersionWithDeps = {
        ...currentVersion,
        dependencies: [...currentVersion.dependencies, data],
      };
      setVersion(updVersion);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleDeleteDependency = async (id: number) => {
    try {
      const response = await fetch(`api/dependencies/${id}`, { method: 'DELETE' });

      if (!response.ok) return showFetchError();

      const updVersion: VersionWithDeps = {
        ...currentVersion,
        dependencies: currentVersion.dependencies.filter((dep) => dep.id !== id),
      };
      setVersion(updVersion);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  return (
    <Card className="px-4 py-2 relative">
      <div className="absolute right-1 top-1">
        <ConfirmationModal
          title={`Remove version: ${currentVersion.value}`}
          message={
            'You are going to completely remove version with all dependencies. Are you sure?'
          }
          onConfirm={() => onDelete(currentVersion.id)}
        />
      </div>

      <div>
        <span className="font-semibold">Version:</span> {currentVersion.value}
      </div>
      <div>
        <span className="font-semibold">Created:</span>{' '}
        {new Date(currentVersion.createdAt).toISOString()}
      </div>
      <div>
        <span className="font-semibold">Built:</span>{' '}
        {currentVersion.builtAt ? new Date(currentVersion.builtAt).toISOString() : 'not built'}
      </div>
      <div>
        <span className="font-semibold">Dependencies:</span>
        <div className="px-4 flex flex-col gap-2 py-2">
          {currentVersion.dependencies.map((dep) => (
            <Card key={dep.id} className="px-4 py-2 relative">
              <div className="absolute right-1 top-1">
                <ConfirmationModal
                  title={`Remove dependency from: ${dep.dependencyAppVersion.app.name}`}
                  message={'You are going to remove dependency. Are you sure?'}
                  onConfirm={() => handleDeleteDependency(dep.id)}
                />
              </div>
              <div>
                <div>
                  <span className="font-bold">App:</span> {dep.dependencyAppVersion.app.name}
                </div>
                <div>
                  <span className="font-bold">Version:</span> {dep.dependencyAppVersion.value}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="px-4">
          <DependencyModal currentAppId={version.appId} onFormSubmit={handleCreateDependency} />
        </div>
      </div>
    </Card>
  );
}
