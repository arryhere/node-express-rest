import { NextFunction, type Response } from 'express';

export function respose_helper(res: Response, status_code: number, message: string, data: object) {
  return res.status(status_code).json({ status_code, message, data });
}
