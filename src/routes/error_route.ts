import { type NextFunction, type Request, type Response, Router } from 'express';
import type Exception from '../helpers/error_helper.js';
import { respose_helper } from '../helpers/response_helper.js';

export const error_route = Router();

error_route.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, 500, error.message, {});
});
