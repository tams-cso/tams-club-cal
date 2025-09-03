import { Request, Response, NextFunction } from 'express';
import { sendError } from '../functions/util';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    sendError(res, err.status, err.message);
}
