import { type NextFunction, type Request, type Response, Router } from 'express';
import { respose_helper } from '../helpers/response_helper.js';

export const page_not_found_router = Router();

page_not_found_router.use((req: Request, res: Response, next: NextFunction) => {
  respose_helper(res, 404, 'Page Not Found', {});
});
