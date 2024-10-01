import { Router } from 'express';
import { UserController } from '../../controllers/user/user.controller.js';
import { auth_middleware } from '../../middlewares/auth.middleware.js';
import { UserService } from '../../services/user/user.service.js';

export const user_route = Router();

const user_service = new UserService();
const user_controller = new UserController(user_service);

user_route.get('/profile', auth_middleware, user_controller.get_profile);
