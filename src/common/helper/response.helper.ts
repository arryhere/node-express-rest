import type { Response } from 'express';
import { config } from '../../config/config.js';
import type { IResponseType } from '../interface/response.interface.js';

interface IResponseHelperInput {
  res: Response;
  status_code: number;
  responseType: IResponseType;
}

export function respose_helper(input: IResponseHelperInput) {
  const { res, status_code, responseType } = input;

  return res.status(status_code).json({
    environment: config.app.env,
    status_code,
    success: responseType.success,
    message: responseType.message,
    data: responseType.data,
  });
}
