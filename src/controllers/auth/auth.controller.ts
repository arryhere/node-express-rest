import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Exception } from '../../common/error/exception.error.js';
import { respose_helper } from '../../common/helper/response.helper.js';
import type { AuthService } from '../../services/auth/auth.service.js';
import { type IForgotPasswordInput, forgot_password_input_schema } from './dto/forgot_password.input.js';
import { type IRefreshTokenInput, refresh_token_input_schema } from './dto/refresh_token.input.js';
import { type IResetPasswordInput, reset_password_input_schema } from './dto/reset_password.input.js';
import { type ISignInInput, signin_input_schema } from './dto/signin.input.js';
import { type ISignUpInput, signup_input_schema } from './dto/signup.input.js';
import { type IVerifyInput, verify_input_schema } from './dto/verify.input.js';
import { type IVerifyLinkInput, verify_link_input_schema } from './dto/verify_link.input.js';

export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const signup_input: ISignUpInput = req.body;

      const validation_result = signup_input_schema.safeParse(signup_input);

      if (!validation_result.success) {
        throw new Exception('Signup validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.signup(signup_input);

      return respose_helper({
        res,
        status_code: httpStatus.CREATED,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  async verify_link(req: Request, res: Response, next: NextFunction) {
    try {
      const verify_link_input: IVerifyLinkInput = req.body;

      const validation_result = verify_link_input_schema.safeParse(verify_link_input);

      if (!validation_result.success) {
        throw new Exception('Verify link validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.verify_link(verify_link_input);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const verify_input: IVerifyInput = req.body;

      const validation_result = verify_input_schema.safeParse(verify_input);

      if (!validation_result.success) {
        throw new Exception('Verify validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.verify(verify_input);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const signin_input: ISignInInput = req.body;

      const validation_result = signin_input_schema.safeParse(signin_input);

      if (!validation_result.success) {
        throw new Exception('Signin validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.signin(signin_input);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh_token(req: Request, res: Response, next: NextFunction) {
    try {
      const refresh_token_input: IRefreshTokenInput = req.body;

      const validation_result = refresh_token_input_schema.safeParse(refresh_token_input);

      if (!validation_result.success) {
        throw new Exception('Refresh token validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.refresh_token(refresh_token_input);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgot_password(req: Request, res: Response, next: NextFunction) {
    try {
      const forgot_password_input: IForgotPasswordInput = req.body;

      const validation_result = forgot_password_input_schema.safeParse(forgot_password_input);

      if (!validation_result.success) {
        throw new Exception('Forgot password validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.forgot_password(forgot_password_input);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }

  async reset_password(req: Request, res: Response, next: NextFunction) {
    try {
      const reset_password_input: IResetPasswordInput = req.body;

      const validation_result = reset_password_input_schema.safeParse(reset_password_input);

      if (!validation_result.success) {
        throw new Exception('Reset password validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.reset_password(reset_password_input);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }
}
