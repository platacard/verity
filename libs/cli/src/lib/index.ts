#!/usr/bin/env node
import * as process from 'node:process';
import { program } from 'commander';

import packageJson from '../../package.json';
import { createApp, createVersion, getApp, getAppVersions, markVersionAsBuilt } from './api';
import { validateEnv, VerityCiContextKeys } from './env';

program.version(packageJson.version).description('CLI tool for Verity CI integration');

program
  .command('run')
  .description('Run a Verity CI job')
  .action(async () => {
    await run();
  });

program.parse(process.argv);

async function run() {
  console.log('Validating environment variables...');
  validateEnv();

  console.log('Check Application...');
  const currentApp = await getApp();

  if (!currentApp) {
    console.log('Current Application does not exists, creating Application with version...');
    const newApp = await createApp();

    if (newApp) {
      const newVersion = await createVersion();
      if (newVersion) {
        console.log(
          `Application "${newApp.id}" with Version "${newVersion.value}" created successfully!`,
        );

        process.exit(0);
      }
    }
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
      console.log(
        `Application "${currentApp.id}" Version "${updatedVersion.value}" updated successfully!`,
      );
      process.exit(0);
    }
  }

  console.log('Version does not exists, creating Version...');
  const newVersion = await createVersion();

  if (newVersion) {
    console.log(
      `Application "${currentApp.id}" Version "${newVersion.value}" created successfully!`,
    );
    process.exit(0);
  }
}
