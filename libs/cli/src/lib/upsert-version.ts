import process from 'node:process';

import { createVersion, getApp, getAppVersions, markVersionAsBuilt } from './api';
import { VerityCiContextKeys } from './env';

export const upsertVersion = async () => {
  console.log('Check Application...');
  const currentApp = await getApp();

  if (!currentApp) {
    console.error('Application not found!');
    process.exit(1);
  }

  console.log('Check Version...');
  const currentAppVersions = await getAppVersions();
  const currentVersion = currentAppVersions.find(
    (version: { value: string }) =>
      version.value === process.env[VerityCiContextKeys.VERITY_APP_VERSION],
  );

  if (currentVersion) {
    console.log('Version exists, updating build time...');
    const updatedVersion = await markVersionAsBuilt(currentVersion.id);

    if (updatedVersion) {
      console.log(`Version "${updatedVersion.value}" updated successfully!`);
      process.exit(0);
    }
  }

  console.log('Version does not exists, creating Version...');
  const newVersion = await createVersion();

  if (newVersion) {
    console.log(`Version "${newVersion.value}" created successfully!`);
    process.exit(0);
  }
};
