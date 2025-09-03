import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * The asyncHandler is used to wrap all asynchronous express routes.
 * This ensures that there are no unhandled errors, which could crash the server.
 * We need to do this because express does NOT catch errors in async functions.
 * 
 * @param fn The express route function handler
 * @returns The same signature but wrapped by a promise resolve block to catch any async errors
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
