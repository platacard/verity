'use client';

import { useEffect, useState } from 'react';

import { AppWithVersionsAndDeps } from '@verity/app';
import { Button } from '@verity/ui/button';

import { AppComponent } from './app-component';

export default function AppsList() {
  const [apps, setItems] = useState([] as AppWithVersionsAndDeps[]);

  useEffect(() => {
    fetch('api/apps')
      .then((response) => response.json())
      .then((data: AppWithVersionsAndDeps[]) => setItems(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Apps</h1>
          <Button>Add App</Button>
        </div>
        <div className="grid gap-4">
          {apps.map((item) => (
            <AppComponent key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
