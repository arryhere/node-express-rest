import { Router } from 'express';
import { page_not_found_router } from './404_route.js';
import { error_router } from './error_route.js';

export const router = Router();

router.use(page_not_found_router);
router.use(error_router);
