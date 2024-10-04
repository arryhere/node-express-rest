import httpStatus from 'http-status';
import { Exception, handle_exception } from '../../common/error/exception.error.js';
import type { IResponseType } from '../../common/interface/response.interface.js';
import { user_model } from '../../model/user/user.model.js';

export class UserService {
  async get_profile(user_email: string): Promise<IResponseType> {
    try {
      const user = await user_model.findOne({
        email: user_email,
      });

      if (!user) {
        throw new Exception('User does not exist', httpStatus.BAD_REQUEST, {});
      }

      return {
        success: true,
        message: 'Get Profile success',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dob: user.dob,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      handle_exception(error, 'Get profile failed', httpStatus.INTERNAL_SERVER_ERROR, {});
    }
  }
}
