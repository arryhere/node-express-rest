import { pino } from 'pino';
import pretty from 'pino-pretty';

const logger = pino(pretty());

export function log_info(message: string, additional_data: unknown = {}) {
  logger.info(additional_data, message);
}

export function log_error(message: string, additional_data: unknown = {}) {
  logger.error(additional_data, message);
}
