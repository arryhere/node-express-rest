import { Router } from 'express';
import { auth_route } from './auth.route.js';
import { base_route } from './base.route.js';
import { health_route } from './health.route.js';
import { page_not_found_route } from './page_not_found.route.js';

export const router = Router();

router.use('/', base_route);
router.use('/health', health_route);
router.use('/auth', auth_route);
router.use(page_not_found_route);
