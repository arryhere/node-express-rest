import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import type Exception from '../helpers/error.helper.js';
import { respose_helper } from '../helpers/response.helper.js';

export const error_route = Router();

error_route.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, httpStatus.INTERNAL_SERVER_ERROR, error.message, {});
});
