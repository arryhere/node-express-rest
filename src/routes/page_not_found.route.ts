import { type NextFunction, type Request, type Response, Router } from 'express';
import httpStatus from 'http-status';
import { respose_helper } from '../helpers/response.helper.js';

export const page_not_found_route = Router();

page_not_found_route.use((req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, httpStatus.NOT_FOUND, 'Page Not Found', {});
});
