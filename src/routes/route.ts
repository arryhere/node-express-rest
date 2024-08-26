import { Router } from 'express';
import { page_not_found_route } from './page_not_found_route.js';
import { error_route } from './error_route.js';

export const router = Router();

router.use(page_not_found_route);
router.use(error_route);
