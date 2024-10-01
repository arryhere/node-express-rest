import { Router } from 'express';
import { AuthController } from '../../controllers/auth/auth.controller.js';
import { AuthService } from '../../services/auth/auth.service.js';
import { EmailService } from '../../services/email/email.service.js';

export const auth_route = Router();

const email_service = new EmailService();
const auth_service = new AuthService(email_service);
const auth_controller = new AuthController(auth_service);

auth_route.post('/signup', auth_controller.signup);
auth_route.get('/signin', auth_controller.signin);
auth_route.get('/refresh_token', auth_controller.refresh_token);
auth_route.get('/forgot_password', auth_controller.forgot_password);
auth_route.put('/reset_password', auth_controller.reset_password);
