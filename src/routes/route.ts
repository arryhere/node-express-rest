import { Router } from 'express';
import { base_route } from './other/base.route.js';
import { health_route } from './other/health.route.js';
import { page_not_found_route } from './other/page_not_found.route.js';
import { auth_route } from './auth/auth.route.js';
import { user_route } from './user/user.route.js';

export const router = Router();

router.use('/', base_route);
router.use('/health', health_route);
router.use('/auth', auth_route);
router.use('/user', user_route);
router.use(page_not_found_route);
