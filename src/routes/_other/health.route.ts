import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import { respose_helper } from '../../helpers/response.helper.js';

export const health_route = Router();

health_route.get('', (req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, httpStatus.OK, 'health check', {});
});
