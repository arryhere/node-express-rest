import type { Response } from 'express';
import { config } from '../../config/config.js';
import type { IResponseType } from '../interface/response.interface.js';

interface IResponseHelperInput {
  res: Response;
  status_code: number;
  response_type: IResponseType;
}

export function respose_helper(input: IResponseHelperInput) {
  const { res, status_code, response_type } = input;

  return res.status(status_code).json({
    environment: config.app.env,
    status_code,
    success: response_type.success,
    message: response_type.message,
    data: response_type.data,
  });
}
