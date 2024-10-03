import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Exception from '../../common/error/exception.error.js';
import { respose_helper } from '../../common/helper/response.helper.js';
import type { UserService } from '../../services/user/user.service.js';

export class UserController {
  constructor(private readonly user_service: UserService) {}

  async get_profile(req: Request, res: Response, next: NextFunction) {
    try {
      const user_email = req.user?.email;

      if (!user_email) {
        throw new Exception('User not found', httpStatus.BAD_REQUEST, {});
      }

      const result = await this.user_service.get_profile(user_email);

      respose_helper(res, httpStatus.OK, 'Get Profile success', result);
    } catch (error) {
      next(error);
    }
  }
}
