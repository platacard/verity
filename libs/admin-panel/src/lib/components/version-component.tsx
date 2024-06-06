import { Card } from '@verity/ui/card';
import { VersionWithDeps } from '@verity/version';

export function VersionComponent(version: VersionWithDeps) {
  return (
    <Card className="px-4 py-1">
      <div>
        <span className="font-bold">Version:</span> {version.value}
      </div>
      <div>
        <span className="font-bold">Created:</span> {new Date(version.createdAt).toISOString()}
      </div>
      <div>
        <span className="font-bold">Built:</span>{' '}
        {version.builtAt ? new Date(version.builtAt).toISOString() : 'not built'}
      </div>
      <div>
        <span className="font-bold">Dependencies:</span>
        <div className="px-4 flex flex-col">
          {version.dependencies.map((dep) => (
            <Card key={dep.id} className="px-4 py-1">
              <div>
                <div>
                  <span className="font-bold block">App:</span> {dep.dependencyAppVersion.appId}
                </div>
                <div>
                  <span className="font-bold block">Version:</span> {dep.dependencyAppVersion.value}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
