import { Router } from 'express';
import { error_route } from './error.route.js';
import { page_not_found_route } from './page_not_found.route.js';

export const router = Router();

router.use(page_not_found_route);
router.use(error_route);
