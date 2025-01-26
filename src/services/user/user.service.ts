import httpStatus from 'http-status';
import { handle_exception } from '../../common/error/exception.error.js';
import type { IResponseType } from '../../common/interface/response.interface.js';
import type { IGetUserAuthLogsInput } from '../../controllers/user/dto/get_user_auth_logs.input.js';
import type { IUser } from '../../model/user/user.model.js';
import { user_auth_log_model } from '../../model/user/user_auth_log.model.js';

export class UserService {
  async get_profile(user: IUser): Promise<IResponseType> {
    try {
      return {
        success: true,
        message: 'Get Profile success',
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dob: user.dob,
          phoneNumber: user.phoneNumber,
          verified: user.verified,
          active: user.active,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      handle_exception(error, 'Get profile failed', httpStatus.INTERNAL_SERVER_ERROR, {});
      throw error;
    }
  }

  async get_user_auth_logs(get_user_auth_logs_input: IGetUserAuthLogsInput): Promise<IResponseType> {
    try {
      const { user_id, start_date, end_date, start_time, end_time, sort_by, limit, page } = get_user_auth_logs_input;

      let sort_order = -1; // default desc
      if (sort_by === 'asc') sort_order = 1;

      const result = await user_auth_log_model.find(
        {
          user: user_id,
          createdAt: { $gte: new Date(`${start_date}T${start_time}Z`), $lte: new Date(`${end_date}T${end_time}Z`) },
        },
        {},
        { limit: limit, skip: limit * page, sort: { createdAt: sort_order } }
      );

      return {
        success: true,
        message: 'Get User Auth Logs success',
        data: {
          limit: limit,
          page: page,
          skip: limit * page,
          count: result.length,
          result,
        },
      };
    } catch (error) {
      handle_exception(error, 'Get User Auth Logs failed', httpStatus.INTERNAL_SERVER_ERROR, {});
      throw error;
    }
  }
}
