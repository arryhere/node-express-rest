import { type ObjectId, Schema, model } from 'mongoose';

export enum TokenType {
  VERIFY_TOKEN = 'VERIFY_TOKEN',
  FORGOT_PASSWORD_TOKEN = 'FORGOT_PASSWORD_TOKEN',
  MFA_TOKEN = 'MFA_TOKEN',
}

interface IToken {
  _id: ObjectId;
  email: string;
  token: string;
  tokenType: TokenType;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    tokenType: { type: String, enum: Object.values(TokenType), required: true },
    issuedAt: { type: Date, expires: '10m', default: Date.now, required: true },
  },
  { timestamps: true }
);

schema.index({ email: 1, token: 1 }, { unique: true });

export const token_model = model<IToken>('token', schema, 'token');
