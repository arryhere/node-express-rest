import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Exception } from '../error/exception.error.js';

export function Roles(...allowedRoles: string[]) {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.user) {
          throw new Exception('Unauthenticated Route: Bad use of roles', httpStatus.FORBIDDEN, {});
        }

        if (!allowedRoles.includes(req.user.role)) {
          throw new Exception(`Access denied: Invalid role: ${req.user.role}`, httpStatus.FORBIDDEN, {});
        }

        return await originalMethod.apply(this, [req, res, next]);
      } catch (error) {
        next(error);
      }
    };

    return descriptor;
  };
}
