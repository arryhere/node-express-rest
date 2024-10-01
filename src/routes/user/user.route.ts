import { type NextFunction, type Request, type Response, Router } from 'express';
import { UserController } from '../../controller/user/user.controller.js';
import { auth_middleware } from '../../middleware/auth.middleware.js';
import { UserService } from '../../service/user/user.service.js';

export const user_route = Router();

const user_service = new UserService();
const user_controller = new UserController(user_service);

user_route.get('/profile', [auth_middleware], (req: Request, res: Response, next: NextFunction) =>
  user_controller.get_profile(req, res, next)
);
