import { type ObjectId, Schema, model } from 'mongoose';

export interface IUserAuthLog {
  _id: ObjectId;
  user: ObjectId;
  action: string;
  metadata: Map<string, string>;
}

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    action: { type: String, default: 'Auth', required: true },
    metadata: { type: Map, of: String }, // e.g., { "ip": "127.0.0.1", "location": "City" }
  },
  { timestamps: true }
);

schema.index({ createdAt: -1 });
schema.index({ updatedAt: -1 });

export const user_auth_log_model = model<IUserAuthLog>('user_auth_log', schema, 'user_auth_log');
