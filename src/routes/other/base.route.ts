import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import { respose_helper } from '../../common/helper/response.helper.js';

export const base_route = Router({ caseSensitive: true, strict: true });

base_route.get('', (req: Request, res: Response, next: NextFunction) => {
  return respose_helper({
    res,
    status_code: httpStatus.OK,
    response_type: { success: true, message: 'server', data: {} },
  });
});
