import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import { response_helper } from '../../common/helper/response.helper.js';

export const page_not_found_route = Router({ caseSensitive: true, strict: true });

page_not_found_route.use((req: Request, res: Response, next: NextFunction) => {
  response_helper({
    res,
    status_code: httpStatus.NOT_FOUND,
    response_type: { success: true, message: 'Page Not Found', data: {} },
  });
});
