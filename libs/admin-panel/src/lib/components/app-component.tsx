'use client';

import { AppWithVersionsAndDeps } from '@verity/app';
import { Card, CardContent, CardHeader } from '@verity/ui/card';

import { VersionComponent } from './version-component';

export function AppComponent(app: AppWithVersionsAndDeps) {
  return (
    <Card className="py-1">
      <CardHeader>
        <div className="flex items-center justify-between px-4">
          <div className="grid gap-1">
            <div>
              <span className="font-bold">Name:</span> <span>{app.id}</span>
            </div>
            <div>
              <span className="font-bold">Created:</span>{' '}
              <span>{new Date(app.createdAt).toISOString()}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="px-4">
          <h3 className="font-bold">Versions:</h3>
          <div className="flex flex-col gap-2 px-3">
            {app.versions.map((version) => (
              <VersionComponent key={version.id} {...version} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
