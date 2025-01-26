import { type NextFunction, type Request, type Response, Router } from 'express';
import { UserController } from '../../controllers/user/user.controller.js';
import { auth_middleware } from '../../middlewares/auth.middleware.js';
import { UserService } from '../../services/user/user.service.js';

export const user_route = Router({ caseSensitive: true, strict: true });

const user_service = new UserService();
const user_controller = new UserController(user_service);

user_route.get('/profile', [auth_middleware], (req: Request, res: Response, next: NextFunction) => {
  user_controller.get_profile(req, res, next);
});

user_route.get('/user_auth_logs', [auth_middleware], (req: Request, res: Response, next: NextFunction) => {
  user_controller.get_user_auth_logs(req, res, next);
});
