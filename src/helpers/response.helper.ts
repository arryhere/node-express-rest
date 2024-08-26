import type { Response } from 'express';
import { config } from '../configs/config.js';

export function respose_helper(res: Response, status_code: number, message: string, data: object) {
  return res.status(status_code).json({ status_code, environment: config.app.env, message, data });
}
