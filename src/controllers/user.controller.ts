import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { respose_helper } from '../helpers/response.helper.js';

export class UserController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      respose_helper(res, httpStatus.OK, 'sign up success', {});
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      respose_helper(res, httpStatus.OK, 'sign in success', {});
    } catch (error) {
      next(error);
    }
  }
}
