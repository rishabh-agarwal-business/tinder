// A handler function so each service can pass its own logger instance

import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { API_ERRORS, AppError } from "../errors/AppError";

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        success: false, code: API_ERRORS.NOT_FOUND, message: `Route ${req.originalUrl} not found`
    });
}

export function buildErrorHandler(logger: Logger, isDev: boolean) {
    return function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction) {
        let statusCode = 500;
        let message = 'Internal server error';
        let code = "INTERNAL_ERROR";

        if (err instanceof AppError) {
            statusCode = err.statusCode;
            message = err.message;
            code = err.code;
        }

        const meta = {
            stack: err.stack,
            path: req.originalUrl,
            requestId: (req as any).requestId
        };

        statusCode >= 500 ? logger.error(message, meta) : logger.warn(message, { code, ...meta });

        res.status(statusCode).json({
            success: false,
            code,
            message,
            ...(isDev && { stack: err.stack }),
        });
    }
}