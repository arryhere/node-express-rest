import { connect } from 'mongoose';
import { config } from '../configs/config.js';
import { log_info } from '../helpers/log.helper.js';

export async function mongodb() {
  const uri = config.db.uri as string;
  await connect(uri);

  log_info('mongodb connection success');
}
