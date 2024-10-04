import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { TokenType } from '../../common/enum/token.enum.js';
import { Exception, handle_exception } from '../../common/error/exception.error.js';
import type { IJwtPayload } from '../../common/interface/jwt_payload.interface.js';
import type { IResponseType } from '../../common/interface/response.interface.js';
import { config } from '../../config/config.js';
import type { ISignInInput } from '../../controllers/auth/dto/signin.input.js';
import type { ISignUpInput } from '../../controllers/auth/dto/signup.input.js';
import type { IVerifyInput } from '../../controllers/auth/dto/verify.input.js';
import type { IVerifyLinkInput } from '../../controllers/auth/dto/verify_link.input.js';
import { token_model } from '../../model/token/token.model.js';
import { user_model } from '../../model/user/user.model.js';
import type { EmailService } from '../email/email.service.js';

export class AuthService {
  constructor(private readonly email_service: EmailService) {}

  async signup(signup_input: ISignUpInput): Promise<IResponseType> {
    try {
      const emailExist = await user_model.findOne({
        email: signup_input.email,
      });

      if (emailExist) {
        throw new Exception('Email already exist', httpStatus.BAD_REQUEST, { email: signup_input.email });
      }

      const verify_token = jwt.sign({ email: signup_input.email }, config.jwt.verify_token_secret, {
        expiresIn: '10m',
      });

      await this.email_service.send_email('User Verification Link', `token: ${verify_token}`, signup_input.email);

      await token_model.create({ email: signup_input.email, token: verify_token, tokenType: TokenType.VERIFY_TOKEN });

      const password_hash = await bcryptjs.hash(signup_input.password, 10);

      await user_model.create({
        firstName: signup_input.firstName,
        lastName: signup_input.lastName,
        email: signup_input.email,
        password_hash: password_hash,
        dob: signup_input.dob,
        phoneNumber: signup_input.phoneNumber,
      });

      return { success: true, message: 'SignUp success, proceed to verification', data: {} };
    } catch (error) {
      handle_exception(error, 'SignUp failed', httpStatus.INTERNAL_SERVER_ERROR, { email: signup_input.email });
      throw error;
    }
  }

  async verify_link(verify_link_input: IVerifyLinkInput): Promise<IResponseType> {
    try {
      const user = await user_model.findOne({ email: verify_link_input.email });

      if (!user) {
        throw new Exception('Invalid user', httpStatus.BAD_REQUEST, { email: verify_link_input.email });
      }

      const password_compare = await bcryptjs.compare(verify_link_input.password, user.password_hash);

      if (!password_compare) {
        throw new Exception('Invalid Credentials', httpStatus.BAD_REQUEST, { email: verify_link_input.email });
      }

      const verify_token = jwt.sign({ email: verify_link_input.email }, config.jwt.verify_token_secret, {
        expiresIn: '10m',
      });

      await this.email_service.send_email('User Verification Link', `token: ${verify_token}`, verify_link_input.email);

      await token_model.create({
        email: verify_link_input.email,
        token: verify_token,
        tokenType: TokenType.VERIFY_TOKEN,
      });

      return { success: true, message: 'Verify link sent successfully', data: {} };
    } catch (error) {
      handle_exception(error, 'Verify link generate failed', httpStatus.INTERNAL_SERVER_ERROR, {
        email: verify_link_input.email,
      });
      throw error;
    }
  }

  async verify(verify_input: IVerifyInput): Promise<IResponseType> {
    try {
      const decoded = jwt.verify(verify_input.token, config.jwt.verify_token_secret) as IJwtPayload;

      const token_exist = await token_model.findOne({ token: verify_input.token, email: decoded.email });

      if (!token_exist) {
        throw new Exception('Invalid Token', httpStatus.BAD_REQUEST, { email: decoded.email });
      }

      const user = await user_model.findOne({ email: decoded.email });

      if (!user) {
        throw new Exception('User does not exist', httpStatus.BAD_REQUEST, { email: decoded.email });
      }

      await user_model.updateOne({ email: decoded.email }, { verified: true });
      await token_model.deleteOne({ token: verify_input.token, email: decoded.email });

      return { success: true, message: 'User verification successful', data: { email: decoded.email } };
    } catch (error) {
      handle_exception(error, 'User verification failed', httpStatus.INTERNAL_SERVER_ERROR, {});
      throw error;
    }
  }

  async signin(signin_input: ISignInInput): Promise<IResponseType> {
    try {
      const user = await user_model.findOne({
        email: signin_input.email,
      });

      if (!user) {
        throw new Exception('Invalid user', httpStatus.BAD_REQUEST, { email: signin_input.email });
      }

      if (!user.verified) {
        throw new Exception('User not verified', httpStatus.FORBIDDEN, { email: signin_input.email });
      }

      if (!user.active) {
        throw new Exception('User not active', httpStatus.FORBIDDEN, { email: signin_input.email });
      }

      const password_compare = await bcryptjs.compare(signin_input.password, user.password_hash);

      if (!password_compare) {
        throw new Exception('Invalid Credentials', httpStatus.BAD_REQUEST, { email: signin_input.email });
      }

      const jwt_payload: IJwtPayload = { email: user.email };

      const access_token = jwt.sign(jwt_payload, config.jwt.access_token_secret, { expiresIn: '1h' });
      const refresh_token = jwt.sign(jwt_payload, config.jwt.refresh_token_secret, { expiresIn: '180d' });

      return { success: true, message: 'SignIn success', data: { access_token, refresh_token } };
    } catch (error) {
      handle_exception(error, 'SignIn failed', httpStatus.INTERNAL_SERVER_ERROR, { email: signin_input.email });
      throw error;
    }
  }

  async refresh_token(refresh_token_input: string): Promise<IResponseType> {
    try {
      const decoded = jwt.verify(refresh_token_input, config.jwt.refresh_token_secret) as IJwtPayload;

      const access_token = jwt.sign({ email: decoded.email }, config.jwt.access_token_secret, { expiresIn: '1h' });
      const refresh_token = jwt.sign({ email: decoded.email }, config.jwt.refresh_token_secret, { expiresIn: '180d' });

      return {
        success: true,
        message: 'Refresh and Access Token generated',
        data: {
          access_token,
          refresh_token,
        },
      };
    } catch (error) {
      handle_exception(error, 'Failed to generate refresh and access tokens', httpStatus.UNAUTHORIZED, {});
      throw error;
    }
  }

  async forgot_password(email: string): Promise<IResponseType> {
    try {
      const user = await user_model.findOne({ email: email });

      if (!user) {
        throw new Exception('User does not exist', httpStatus.BAD_REQUEST, { email: email });
      }

      const token = jwt.sign({ email }, config.jwt.forgot_password_token_secret, { expiresIn: '10m' });

      await this.email_service.send_email('Forgot Password Link', `token: ${token}`, email);

      await token_model.create({ email: email, token: token, tokenType: TokenType.FORGOT_PASSWORD_TOKEN });

      return { success: true, message: 'Forgot password email sent', data: {} };
    } catch (error) {
      handle_exception(error, 'Failed to generate refresh and access tokens', httpStatus.UNAUTHORIZED, {});
      throw error;
    }
  }

  async reset_password(token: string, new_password: string): Promise<IResponseType> {
    try {
      const decoded = jwt.verify(token, config.jwt.forgot_password_token_secret) as IJwtPayload;

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

      return { success: true, message: 'Reset password success', data: {} };
    } catch (error) {
      handle_exception(error, 'Invalid Token', httpStatus.UNAUTHORIZED, {});
      throw error;
    }
  }
}
