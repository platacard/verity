#!/usr/bin/env node
import { program } from 'commander';

import packageJson from '../../package.json';

program.version(packageJson.version).description('CLI tool for Verity CI integration');

program
  .command('run')
  .description('Run a Verity CI job')
  .action(() => {
    console.log('Running job');
  });

program.parse(process.argv);
