import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import { respose_helper } from '../helpers/response.helper.js';

export const base_route = Router();

base_route.get('', (req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, httpStatus.OK, 'server', {});
});
