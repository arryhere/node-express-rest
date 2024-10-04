import { connect } from 'mongoose';
import { log_info } from '../common/helper/log.helper.js';
import { config } from '../config/config.js';

export async function mongodb() {
  const uri = config.db.uri;
  await connect(uri);

  log_info('mongodb connection success');
}
