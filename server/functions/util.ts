import type { Request, Response } from 'express';
import * as uuid from 'uuid';
import statusList from '../files/status.json';
import envList from '../files/env.json';

/**
 * Checks that all the neccessary environmental variables
 * are defined before running the app.
 * The function will throw an error and exit the app if
 * a variable is missing.
 */
export function checkEnv() {
    envList.forEach((e) => {
        if (process.env[e] === undefined) {
            console.error(`ERROR: The ${e} environmental variable was not defined.`);
            process.exit(1);
        }
    });
}

/**
 * Sends an error with the provided status
 * (see: https://httpstatuses.com/) and error message.
 * The status codes are in ../files/status.json
 */
export function sendError(res: Response, status: number, message: string) {
    res.status(status);
    res.send({
        status,
        statusMessage: `${status} ${statusList[status]}`,
        error: message,
    });
}

/**
 * Creates and returns a new UUIDv4
 */
export function newId(): string {
    return uuid.v4();
}

/**
 * Extracts the IP address from the header of the express request object
 */
export function getIp(req: Request): string {
    return (req.headers['x-real-ip'] as string) || req.ip;
}
