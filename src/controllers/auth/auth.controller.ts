import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Exception } from '../../common/error/exception.error.js';
import { response_helper } from '../../common/helper/response.helper.js';
import type { AuthService } from '../../services/auth/auth.service.js';
import { forgot_password_input_schema } from './dto/forgot_password.input.js';
import { refresh_token_input_schema } from './dto/refresh_token.input.js';
import { reset_password_input_schema } from './dto/reset_password.input.js';
import { signin_input_schema } from './dto/signin.input.js';
import { signup_input_schema } from './dto/signup.input.js';
import { verify_input_schema } from './dto/verify.input.js';
import { verify_link_input_schema } from './dto/verify_link.input.js';

export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validation_result = signup_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Signup validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.signup(validation_result.data);

      return response_helper({
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
      const validation_result = verify_link_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Verify link validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.verify_link(validation_result.data);

      return response_helper({
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
      const validation_result = verify_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Verify validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.verify(validation_result.data);

      return response_helper({
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
      const validation_result = signin_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Signin validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.signin(validation_result.data);

      return response_helper({
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
      const validation_result = refresh_token_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Refresh token validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.refresh_token(validation_result.data);

      return response_helper({
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
      const validation_result = forgot_password_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Forgot password validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.forgot_password(validation_result.data);

      return response_helper({
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
      const validation_result = reset_password_input_schema.safeParse(req.body);

      if (!validation_result.success) {
        throw new Exception('Reset password validation failed', httpStatus.BAD_REQUEST, validation_result.error);
      }

      const response_type = await this.auth_service.reset_password(validation_result.data);

      return response_helper({
        res,
        status_code: httpStatus.OK,
        response_type,
      });
    } catch (error) {
      next(error);
    }
  }
}
