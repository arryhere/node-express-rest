import { Document, Schema, model } from 'mongoose';

interface IResetPasswordToken {
  email: string;
  token: string;
  issuedAt: Date;
}

const schema = new Schema(
  {
    token: { type: String, required: true },
    issuedAt: { type: Date, expires: '10m', default: Date.now },
  },
  { timestamps: true }
);

export const reset_password_token_model = model<IResetPasswordToken>(
  'reset_password_token',
  schema,
  'reset_password_token'
);
