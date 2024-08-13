import * as apm from 'elastic-apm-node';

if (process.env.ELASTIC_APM_ACTIVE === 'true') {
  console.log('Initiating elastic APM agent');

  apm.start();

  console.log(
    `APM agent is started: ${apm.isStarted()}, service environment: ${apm.getServiceEnvironment()}`,
  );
}
