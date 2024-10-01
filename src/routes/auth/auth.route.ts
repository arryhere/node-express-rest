import { type NextFunction, type Request, type Response, Router } from 'express';
import { AuthController } from '../../controllers/auth/auth.controller.js';
import { AuthService } from '../../services/auth/auth.service.js';
import { EmailService } from '../../services/email/email.service.js';

export const auth_route = Router();

const email_service = new EmailService();
const auth_service = new AuthService(email_service);
const auth_controller = new AuthController(auth_service);

auth_route.post('/signup', (req: Request, res: Response, next: NextFunction) => auth_controller.signup(req, res, next));
auth_route.get('/signin', (req: Request, res: Response, next: NextFunction) => auth_controller.signin(req, res, next));
auth_route.get('/refresh_token', (req: Request, res: Response, next: NextFunction) =>
  auth_controller.refresh_token(req, res, next)
);
auth_route.get('/forgot_password', (req: Request, res: Response, next: NextFunction) =>
  auth_controller.forgot_password(req, res, next)
);
auth_route.put('/reset_password', (req: Request, res: Response, next: NextFunction) =>
  auth_controller.reset_password(req, res, next)
);
