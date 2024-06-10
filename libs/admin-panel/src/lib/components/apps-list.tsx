'use client';

import { useEffect, useState } from 'react';

import { AppWithVersionsAndDeps } from '@verity/app';

import { AppComponent } from './app-component';
import { InputModal } from './input-modal';

export default function AppsList() {
  const [apps, setItems] = useState([] as AppWithVersionsAndDeps[]);

  useEffect(() => updateAppList(), []);

  const updateAppList = () => {
    fetch('api/apps')
      .then((response) => response.json())
      .then((data: AppWithVersionsAndDeps[]) => setItems(data))
      .catch((error) => console.error('Error:', error));
  };

  const handleAddApp = (id: string) => {
    fetch('api/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data: AppWithVersionsAndDeps) => setItems([...apps, { ...data, versions: [] }]))
      .catch((error) => console.error('Error:', error));
  };

  const handleDeleteApp = (id: string) => {
    fetch(`api/apps/${id}`, {
      method: 'DELETE',
    })
      .then(() => updateAppList())
      .catch((error) => console.error('Error:', error));
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
