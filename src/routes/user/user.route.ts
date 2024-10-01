import { Router } from 'express';
import { UserController } from '../../controllers/user/user.controller.js';
import { auth_middleware } from '../../middlewares/auth.middleware.js';

export const user_route = Router();

const user_controller = new UserController();

user_route.get('/profile', auth_middleware, user_controller.get_profile);
