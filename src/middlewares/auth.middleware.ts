import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../configs/config.js';
import Exception from '../helpers/error.helper.js';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export async function auth_middleware(req: Request, res: Response, next: NextFunction) {
  try {
    const access_token = req.headers?.authorization?.slice(0, 7);
    if (!access_token) throw new Exception('Authentication Failed', httpStatus.UNAUTHORIZED, {});

    const decoded = jwt.verify(access_token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}
