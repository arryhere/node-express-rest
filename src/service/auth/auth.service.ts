import bcryptjs from 'bcryptjs';
import { isMatch } from 'date-fns';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import Exception from '../../common/error/exception.error.js';
import type { IJwtPayload } from '../../common/interface/jwt_payload.interface.js';
import { config } from '../../config/config.js';
import type { ISignInInput } from '../../controller/auth/dto/signin.input.js';
import type { ISignUpInput } from '../../controller/auth/dto/signup.input.js';
import { reset_password_token_model } from '../../model/token/reset_password_token.model.js';
import { user_model } from '../../model/user/user.model.js';
import type { EmailService } from '../email/email.service.js';

export class AuthService {
  constructor(private readonly email_service: EmailService) {}

  async signup(signupDTO: ISignUpInput): Promise<void> {
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

  async signin(signinDTO: ISignInInput) {
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

    const jwt_payload: IJwtPayload = { id: user._id.toString(), email: user.email };

    const access_token = jwt.sign(jwt_payload, config.jwt.auth_secret, { expiresIn: '1h' });
    const refresh_token = jwt.sign(jwt_payload, config.jwt.auth_secret, { expiresIn: '180d' });

    return { access_token, refresh_token };
  }

  async refresh_token(refresh_token: string) {
    try {
      const decoded = jwt.verify(refresh_token, config.jwt.auth_secret) as IJwtPayload;

      const _access_token = jwt.sign({ id: decoded.id, email: decoded.email }, config.jwt.auth_secret, {
        expiresIn: '1h',
      });
      const _refresh_token = jwt.sign({ id: decoded.id, email: decoded.email }, config.jwt.auth_secret, {
        expiresIn: '180d',
      });

      return { access_token: _access_token, refresh_token: _refresh_token };
    } catch (error) {
      throw new Exception('Invalid Credentials', httpStatus.UNAUTHORIZED, {});
    }
  }

  async forgot_password(email: string) {
    const user = await user_model.findOne({ email: email });

    if (!user) {
      throw new Exception('User does not exist', httpStatus.BAD_REQUEST, { email: email });
    }

    const token = jwt.sign({ email }, config.jwt.forgot_password_secret, { expiresIn: '10m' });

    await this.email_service.send_email('Reset Password Link', `token: ${token}`, email);
  }

  async reset_password(token: string, new_password: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.forgot_password_secret) as { email: string };

      const token_exist = await reset_password_token_model.findOne({ token: token });

      if (token_exist) {
        throw new Error();
      }

      const email = decoded.email;

      const user = await user_model.findOne({ email: email });

      if (!user) {
        throw new Exception('User does not exist', httpStatus.BAD_REQUEST, { email: email });
      }

      const password_hash = await bcryptjs.hash(new_password, 10);

      await user_model.updateOne({ email: email }, { password_hash: password_hash });

      await reset_password_token_model.create({ token: token });
    } catch (error) {
      throw new Exception('Invalid Token', httpStatus.UNAUTHORIZED, {});
    }
  }
}
