import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Exception from '../../helpers/error.helper.js';
import { respose_helper } from '../../helpers/response.helper.js';
import { AuthService } from '../../services/auth/auth.service.js';
import type { ISignInDTO } from './signinDTO.interface.js';
import type { ISignUpDTO } from './signupDTO.interface.js';

const auth_service = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const signupDTO: ISignUpDTO = req.body;

      await auth_service.signup(signupDTO);

      respose_helper(res, httpStatus.CREATED, 'SignUp success', {});
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const signinDTO: ISignInDTO = req.body;

      const result = await auth_service.signin(signinDTO);

      respose_helper(res, httpStatus.OK, 'SignIn success', result);
    } catch (error) {
      next(error);
    }
  }

  async refresh_token(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      const result = await auth_service.refresh_token(refresh_token);

      respose_helper(res, httpStatus.OK, 'Refresh and Access Token generated', result);
    } catch (error) {
      next(error);
    }
  }

  async forgot_password(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Exception('Invaid email', httpStatus.BAD_REQUEST, { email });
      }

      await auth_service.forgot_password(email);

      respose_helper(res, httpStatus.OK, 'Forgot password email sent', {});
    } catch (error) {
      next(error);
    }
  }

  async reset_password(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      const { new_password } = req.body;

      if (!token) {
        throw new Exception('Invaid token', httpStatus.BAD_REQUEST, {});
      }

      if (!new_password) {
        throw new Exception('Invaid new password', httpStatus.BAD_REQUEST, {});
      }

      await auth_service.reset_password(String(token), new_password);

      respose_helper(res, httpStatus.OK, 'Reset password success', {});
    } catch (error) {
      next(error);
    }
  }
}
