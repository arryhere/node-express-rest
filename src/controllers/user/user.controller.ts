import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Exception from '../../helpers/error.helper.js';
import { respose_helper } from '../../helpers/response.helper.js';
import type { UserService } from '../../services/user/user.service.js';

export class UserController {
  constructor(private readonly user_service: UserService) {}

  async get_profile(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        throw new Exception('User id not found', httpStatus.BAD_REQUEST, {});
      }

      const result = await this.user_service.get_profile(user_id);

      respose_helper(res, httpStatus.OK, 'Get Profile success', result);
    } catch (error) {
      next(error);
    }
  }
}
