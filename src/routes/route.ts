import { Router } from 'express';
import { base_route } from './base.route.js';
import { error_route } from './error.route.js';
import { health_route } from './health.route.js';
import { page_not_found_route } from './page_not_found.route.js';
import { user_route } from './user.route.js';

export const router = Router();

router.use('/', base_route);
router.use('/health', health_route);
router.use('/user', user_route);
router.use(page_not_found_route);
router.use(error_route);
