import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Exception from '../../common/error/exception.error.js';
import { respose_helper } from '../../common/helper/response.helper.js';
import type { AuthService } from '../../services/auth/auth.service.js';
import { type ISignInInput, signin_input_schema } from './dto/signin.input.js';
import { type ISignUpInput, signup_input_schema } from './dto/signup.input.js';
import { type IVerifyLinkInput, verify_link_input_schema } from './dto/verify_link.input.js';

export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const signupInput: ISignUpInput = req.body;

      const validation_result = signup_input_schema.safeParse(signupInput);

      if (!validation_result.success) {
        throw new Exception('Signup validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const responseType = await this.auth_service.signup(signupInput);

      return respose_helper({
        res,
        status_code: httpStatus.CREATED,
        responseType,
      });
    } catch (error) {
      next(error);
    }
  }

  async verify_link(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyLinkInput: IVerifyLinkInput = req.body;

      const validation_result = verify_link_input_schema.safeParse(verifyLinkInput);

      if (!validation_result.success) {
        throw new Exception('Verify link validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const responseType = await this.auth_service.verify_link(verifyLinkInput);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        responseType,
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const signinInput: ISignInInput = req.body;

      const validation_result = signin_input_schema.safeParse(signinInput);

      if (!validation_result.success) {
        throw new Exception('Signin validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const responseType = await this.auth_service.signin(signinInput);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        responseType,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh_token(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      const responseType = await this.auth_service.refresh_token(refresh_token);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        responseType,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgot_password(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Exception('Invalid email', httpStatus.BAD_REQUEST, { email });
      }

      const responseType = await this.auth_service.forgot_password(email);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        responseType,
      });
    } catch (error) {
      next(error);
    }
  }

  async reset_password(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      const { new_password } = req.body;

      if (!token) {
        throw new Exception('Invalid token', httpStatus.BAD_REQUEST, {});
      }

      if (!new_password) {
        throw new Exception('Invalid new password', httpStatus.BAD_REQUEST, {});
      }

      const responseType = await this.auth_service.reset_password(String(token), new_password);

      return respose_helper({
        res,
        status_code: httpStatus.OK,
        responseType,
      });
    } catch (error) {
      next(error);
    }
  }
}
