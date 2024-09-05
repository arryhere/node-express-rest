import httpStatus from 'http-status';
import Exception from '../../helpers/error.helper.js';
import { user_model } from '../../models/user.model.js';

export class UserService {
  async get_profile(user_id: string) {
    const user = await user_model.findOne({
      _id: user_id,
    });

    if (!user) {
      throw new Exception('User does not exist', httpStatus.BAD_REQUEST, {});
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      phoneNumber: user.phoneNumber,
    };
  }
}
