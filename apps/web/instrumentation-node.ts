import * as apm from 'elastic-apm-node';

import { logger } from '@verity/logger';

if (process.env.ELASTIC_APM_ACTIVE === 'true') {
  logger.info('Initiating elastic APM agent');

  apm.start();

  logger.info(
    `APM agent is started: ${apm.isStarted()}, service environment: ${apm.getServiceEnvironment()}`,
  );
}
