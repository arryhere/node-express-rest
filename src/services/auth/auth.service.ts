import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { TokenType } from '../../common/enum/token.enum.js';
import Exception from '../../common/error/exception.error.js';
import type { IJwtPayload } from '../../common/interface/jwt_payload.interface.js';
import { config } from '../../config/config.js';
import type { ISignInInput } from '../../controllers/auth/dto/signin.input.js';
import type { ISignUpInput } from '../../controllers/auth/dto/signup.input.js';
import { token_model } from '../../model/token/token.model.js';
import { user_model } from '../../model/user/user.model.js';
import type { EmailService } from '../email/email.service.js';

export class AuthService {
  constructor(private readonly email_service: EmailService) {}

  async signup(signupDTO: ISignUpInput): Promise<void> {
    const emailExist = await user_model.findOne({
      email: signupDTO.email,
    });

    if (emailExist) {
      throw new Exception('Email already exist', httpStatus.BAD_REQUEST, { email: signupDTO.email });
    }

    const password_hash = await bcryptjs.hash(signupDTO.password, 10);

    await user_model.create({
      firstName: signupDTO.firstName,
      lastName: signupDTO.lastName,
      email: signupDTO.email,
      password_hash: password_hash,
      dob: signupDTO.dob,
      phoneNumber: signupDTO.phoneNumber,
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

    const jwt_payload: IJwtPayload = { email: user.email };

    const access_token = jwt.sign(jwt_payload, config.jwt.auth_secret, { expiresIn: '1h' });
    const refresh_token = jwt.sign(jwt_payload, config.jwt.auth_secret, { expiresIn: '180d' });

    return { access_token, refresh_token };
  }

  async refresh_token(refresh_token: string) {
    try {
      const decoded = jwt.verify(refresh_token, config.jwt.auth_secret) as IJwtPayload;

      const _access_token = jwt.sign({ email: decoded.email }, config.jwt.auth_secret, {
        expiresIn: '1h',
      });
      const _refresh_token = jwt.sign({ email: decoded.email }, config.jwt.auth_secret, {
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

    await this.email_service.send_email('Forgot Password Link', `token: ${token}`, email);

    await token_model.create({ email: email, token: token, tokenType: TokenType.FORGOT_PASSWORD_TOKEN });
  }

  async reset_password(token: string, new_password: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.forgot_password_secret) as IJwtPayload;

      const token_exist = await token_model.findOne({ token: token, email: decoded.email });

      if (!token_exist) {
        throw new Exception('Invalid Token', httpStatus.BAD_REQUEST, { email: decoded.email });
      }

      const user = await user_model.findOne({ email: decoded.email });

      if (!user) {
        throw new Exception('User does not exist', httpStatus.BAD_REQUEST, { email: decoded.email });
      }

      const password_hash = await bcryptjs.hash(new_password, 10);

      await user_model.updateOne({ email: user.email }, { password_hash: password_hash });

      await token_model.deleteOne({ token: token, email: decoded.email });
    } catch (error) {
      throw new Exception('Invalid Token', httpStatus.UNAUTHORIZED, {});
    }
  }
}
