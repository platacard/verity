'use client';

import { useEffect, useState } from 'react';

import { AppWithVersionsAndDeps } from '@verity/app';
import { Card, CardContent, CardHeader } from '@verity/ui/card';

import { useFetchErrorToast } from '../utils/show-fetch-error';
import { ConfirmationModal } from './confirmation-modal';
import { InputModal } from './input-modal';
import { VersionComponent } from './version-component';

export interface AppComponentProps {
  readonly app: AppWithVersionsAndDeps;
  readonly updateAppList: () => void;
  readonly onDelete: (id: string) => void;
}

export function AppComponent({ app, onDelete, updateAppList }: AppComponentProps) {
  const [application, setApplication] = useState(app);
  const showFetchError = useFetchErrorToast();

  useEffect(() => {
    setApplication(app);
  }, [app]);

  const handleCreateVersion = async (version: string) => {
    try {
      const response = await fetch('api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id, value: version }),
      });
      const data = await response.json();

      if (!response.ok) return showFetchError();

      setApplication({
        ...application,
        versions: [...application.versions, { ...data, dependencies: [] }],
      });
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleDeleteVersion = async (id: number) => {
    try {
      const response = await fetch(`api/versions/${id}`, { method: 'DELETE' });

      if (!response.ok) return showFetchError();

      updateAppList();
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  return (
    <Card className="relative">
      <div className="absolute right-1 top-1">
        <ConfirmationModal
          title={`Remove application: ${app.id}`}
          message={
            'You are going to completely remove application with all versions and dependencies. Are you sure?'
          }
          onConfirm={() => onDelete(app.id)}
        />
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <div>
              <span className="font-bold">Name:</span> <span>{application.id}</span>
            </div>
            <div>
              <span className="font-bold">Created:</span>{' '}
              <span>{new Date(app.createdAt).toISOString()}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="font-bold">Versions:</h3>
        <div className="flex flex-col gap-2 mb-2">
          {application.versions.map((version) => (
            <VersionComponent key={version.id} version={version} onDelete={handleDeleteVersion} />
          ))}
        </div>
        <InputModal
          config={{
            buttonLabel: '+ Add Version',
            title: 'Add new Version',
            description: 'Add new version of application',
            inputLabel: 'Version:',
          }}
          onFormSubmit={handleCreateVersion}
        />
      </CardContent>
    </Card>
  );
}
