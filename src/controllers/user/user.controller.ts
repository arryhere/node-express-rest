import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Roles } from '../../common/decorator/roles.decorator.js';
import { Exception } from '../../common/error/exception.error.js';
import { response_helper } from '../../common/helper/response.helper.js';
import { Role } from '../../model/user/user.model.js';
import type { UserService } from '../../services/user/user.service.js';
import { get_user_auth_logs_input_schema } from './dto/get_user_auth_logs.input.js';

export class UserController {
  constructor(private readonly user_service: UserService) {}

  async get_profile(req: Request, res: Response, next: NextFunction) {
    try {
      const response_type = await this.user_service.get_profile(req.user);

      return response_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async get_user_auth_logs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;

      const get_user_auth_logs_input = {
        user_id: query.user_id,
        start_date: query.start_date,
        end_date: query.end_date,
        start_time: query.start_time,
        end_time: query.end_time,
        sort_by: query.sort_by,
        limit: Number(query.limit),
        page: Number(query.page),
      };

      const validation_result = get_user_auth_logs_input_schema.safeParse(get_user_auth_logs_input);

      if (!validation_result.success) {
        throw new Exception('Get User Auth Logs failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.user_service.get_user_auth_logs(validation_result.data);

      return response_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }
}
