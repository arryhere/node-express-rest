import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import { respose_helper } from '../../common/helper/response.helper.js';

export const base_route = Router();

base_route.get('', (req: Request, res: Response, next: NextFunction) => {
  return respose_helper({
    res,
    status_code: httpStatus.OK,
    responseType: { success: true, message: 'server', data: {} },
  });
});
