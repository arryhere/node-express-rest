import { pino } from 'pino';
import pretty from 'pino-pretty';

const logger = pino(pretty());

export function log_info(message: string) {
  logger.info(message);
}

export function log_error(message: string) {
  logger.error(message);
}
