import type { Response } from 'express';
import httpStatus from 'http-status';
import { config } from '../configs/config.js';

export function respose_helper(res: Response, status_code: number, message: string, data: object) {
  return res.status(status_code ?? httpStatus.INTERNAL_SERVER_ERROR).json({
    status_code: status_code ?? null,
    environment: config.app.env ?? null,
    message: message ?? null,
    data: data ?? null,
  });
}
