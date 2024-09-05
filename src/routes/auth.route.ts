import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller.js';

export const auth_route = Router();

const auth_controller = new AuthController();

auth_route.post('/signup', auth_controller.signup);
auth_route.get('/signin', auth_controller.signin);
auth_route.get('/refresh_token', auth_controller.refresh_token);
