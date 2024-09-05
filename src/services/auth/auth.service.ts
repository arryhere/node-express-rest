import bcryptjs from 'bcryptjs';
import { isMatch } from 'date-fns';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../../configs/config.js';
import type { IJwtDecoded } from '../../controllers/auth/jwt_decoded.interface.js';
import type { ISignInDTO } from '../../controllers/auth/signinDTO.interface.js';
import type { ISignUpDTO } from '../../controllers/auth/signupDTO.interface.js';
import Exception from '../../helpers/error.helper.js';
import { user_model } from '../../models/user.model.js';

export class AuthService {
  async signup(signupDTO: ISignUpDTO): Promise<void> {
    const signUp_schema = z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
      dob: z.string().refine((val) => {
        const test = /^\d{4}-\d{2}-\d{2}$/.test(val);
        if (!test) return false;
        const match = isMatch(val, 'yyyy-MM-dd');
        if (!match) return false;
        return true;
      }, 'Invalid date format, expected yyyy-MM-dd'),
      phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    });

    const result = signUp_schema.safeParse(signupDTO);

    if (!result.success) {
      throw new Exception('signup validation failed', httpStatus.BAD_REQUEST, result.error);
    }

    const emailExist = await user_model.findOne({
      email: result.data.email,
    });

    if (emailExist) {
      throw new Exception('Email already exist', httpStatus.BAD_REQUEST, { email: result.data.email });
    }

    const password_hash = await bcryptjs.hash(result.data.password, 10);

    await user_model.create({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      password_hash: password_hash,
      dob: result.data.dob,
      phoneNumber: result.data.phoneNumber,
    });
  }

  async signin(signinDTO: ISignInDTO) {
    const user = await user_model.findOne({
      email: signinDTO.email,
    });

    if (!user) {
      throw new Exception('User does not exist', httpStatus.BAD_REQUEST, { email: signinDTO.email });
    }

    const password_compare = await bcryptjs.compare(signinDTO.password, user.password_hash);

    if (!password_compare) {
      throw new Exception('Invalid Credentials', httpStatus.BAD_REQUEST, { email: signinDTO.email });
    }

    const jwt_payload: IJwtDecoded = { id: user._id.toString(), email: user.email };

    const access_token = jwt.sign(jwt_payload, config.jwt.secret, { expiresIn: '1h' });
    const refresh_token = jwt.sign(jwt_payload, config.jwt.secret, { expiresIn: '180d' });

    return { access_token, refresh_token };
  }

  async refresh_token(refresh_token: string) {
    try {
      const decoded = jwt.verify(refresh_token, config.jwt.secret) as IJwtDecoded;

      const _access_token = jwt.sign({ id: decoded.id, email: decoded.email }, config.jwt.secret, { expiresIn: '1h' });
      const _refresh_token = jwt.sign({ id: decoded.id, email: decoded.email }, config.jwt.secret, { expiresIn: '180d' });

      return { access_token: _access_token, refresh_token: _refresh_token };
    } catch (error) {
      throw new Exception('Invalid Credentials', httpStatus.UNAUTHORIZED, {});
    }
  }
}
