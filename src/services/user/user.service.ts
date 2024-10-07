import httpStatus from 'http-status';
import { handle_exception } from '../../common/error/exception.error.js';
import type { IResponseType } from '../../common/interface/response.interface.js';
import type { IUser } from '../../model/user/user.model.js';

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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      handle_exception(error, 'Get profile failed', httpStatus.INTERNAL_SERVER_ERROR, {});
      throw error;
    }
  }
}
