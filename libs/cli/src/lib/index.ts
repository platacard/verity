#!/usr/bin/env node
import * as process from 'node:process';
import { program } from 'commander';

import packageJson from '../../package.json';
import { validateEnv } from './env';
import { upsertVersion } from './upsert-version';

program.version(packageJson.version).description('CLI tool for Verity CI integration');

const versionsCommand = program.command('version').description('Manage versions');

versionsCommand
  .command('upsert')
  .description(
    'Marks the current version as built, or creates and marks a new version if it does not exist.',
  )
  .option('--force-create-app', 'Force create application if it does not exist')
  .action(async (cmd) => {
    validateEnv();
    await upsertVersion(cmd.forceCreateApp);
  });

program.parse(process.argv);
