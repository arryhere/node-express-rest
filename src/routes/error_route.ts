import { type NextFunction, type Request, type Response, Router } from 'express';
import type Exception from '../helper/error_helper.js';
import { respose_helper } from '../helper/response_helper.js';

export const error_router = Router();

error_router.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, 500, error.message, {});
});
