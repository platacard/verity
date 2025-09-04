import { logger } from '@verity/logger';

export async function setupApm(): Promise<void> {
  if (process.env.ELASTIC_APM_ACTIVE === 'true') {
    logger.info('Initiating elastic APM agent');

    // Use a runtime import to avoid bundlers trying to statically resolve optional deps
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const apm = require('elastic-apm-node') as typeof import('elastic-apm-node');

    apm.start();

    logger.info(
      `APM agent is started: ${apm.isStarted()}, service environment: ${apm.getServiceEnvironment()}`,
    );
  }
}
