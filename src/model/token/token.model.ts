import { Schema, model } from 'mongoose';
import { TokenType } from '../../common/enum/token.enum.js';

interface IToken {
  email: string;
  token: string;
  tokenType: TokenType;
  issuedAt: Date;
}

const schema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    tokenType: { type: String, enum: Object.values(TokenType), required: true },
    issuedAt: { type: Date, expires: '10m', default: Date.now },
  },
  { timestamps: true }
);

export const token_model = model<IToken>('token', schema, 'token');
