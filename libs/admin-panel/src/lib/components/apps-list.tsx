'use client';

import { useEffect, useState } from 'react';

import { AppWithVersionsAndDeps } from '@verity/app';

import { useFetchErrorToast } from '../utils/show-fetch-error';
import { AppComponent } from './app-component';
import { InputModal } from './input-modal';

export default function AppsList() {
  const [apps, setApps] = useState([] as AppWithVersionsAndDeps[]);
  const showFetchError = useFetchErrorToast();

  useEffect(() => void updateAppList(), []);

  const updateAppList = async () => {
    try {
      const response = await fetch('api/apps');
      const data: AppWithVersionsAndDeps[] = await response.json();

      if (!response.ok) return showFetchError();

      setApps(data);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleAddApp = async (id: string) => {
    try {
      const response = await fetch('api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data: AppWithVersionsAndDeps = await response.json();

      if (!response.ok) return showFetchError();

      setApps([...apps, { ...data, versions: [] }]);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleDeleteApp = async (id: string) => {
    try {
      await fetch(`api/apps/${id}`, { method: 'DELETE' });

      void updateAppList();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto px-4 md:px-0">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold li">Apps</h1>
            <InputModal
              config={{
                buttonLabel: '+ Create App',
                title: 'Create new App',
                description: 'Create new application instance',
                inputLabel: 'Name (appId):',
              }}
              onFormSubmit={handleAddApp}
            />
          </div>
          <div className="grid gap-4">
            {apps.map((item) => (
              <AppComponent
                key={item.id}
                app={item}
                updateAppList={updateAppList}
                onDelete={handleDeleteApp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
