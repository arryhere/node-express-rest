import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { Exception, handle_exception } from '../common/error/exception.error.js';
import type { IJwtPayload } from '../common/interface/jwt_payload.interface.js';
import { config } from '../config/config.js';
import { type IUser, Role, user_model } from '../model/user/user.model.js';
import { user_auth_log_model } from '../model/user/user_auth_log.model.js';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export async function auth_middleware(req: Request, res: Response, next: NextFunction) {
  try {
    const access_token = req.headers?.authorization?.slice(7);

    if (!access_token) {
      throw new Exception('Authentication Failed', httpStatus.UNAUTHORIZED, {});
    }

    const decoded = jwt.verify(access_token, config.jwt.access_token_secret) as IJwtPayload;

    const user = await user_model.findOne({ email: decoded.email });

    if (!user) {
      throw new Exception('Invalid user', httpStatus.UNAUTHORIZED, {});
    }

    req.user = user.toObject();

    if (req.user.role !== Role.SUPER_ADMIN && req.user.role !== Role.ADMIN) {
      await user_auth_log_model.create({
        user: req.user._id,
      });
    }

    next();
  } catch (error) {
    try {
      handle_exception(error, 'Authentication Failed', httpStatus.UNAUTHORIZED, {});
    } catch (error) {
      next(error);
    }
  }
}
