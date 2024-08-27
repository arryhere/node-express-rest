import { connect } from 'mongoose';
import { config } from '../configs/config.js';

export async function mongodb() {
  const uri = config.db.uri as string;
  await connect(uri);

  console.log('mongodb connection success');
}
