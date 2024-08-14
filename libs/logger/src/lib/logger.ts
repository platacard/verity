import { ecsFormat } from '@elastic/ecs-pino-format';
import pino from 'pino';

export const logger = pino(ecsFormat({ convertReqRes: true, apmIntegration: true }));
