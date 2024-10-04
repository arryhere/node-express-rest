import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import Exception from '../common/error/exception.error.js';
import type { IJwtPayload } from '../common/interface/jwt_payload.interface.js';
import { config } from '../config/config.js';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export async function auth_middleware(req: Request, res: Response, next: NextFunction) {
  try {
    const access_token = req.headers?.authorization?.slice(7);

    if (!access_token) {
      throw new Exception('Authentication Failed', httpStatus.UNAUTHORIZED, {});
    }

    try {
      const decoded = jwt.verify(access_token, config.jwt.access_token_secret) as IJwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      throw new Exception('Authentication Failed', httpStatus.UNAUTHORIZED, {});
    }
  } catch (error) {
    next(error);
  }
}
