import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

export const user_route = Router();

const user_controller = new UserController();

user_route.post('/signup', user_controller.signup);
user_route.get('/signin', user_controller.signin);
