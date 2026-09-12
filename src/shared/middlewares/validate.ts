import { NextFunction, Request, Response } from "express";
import { z } from 'zod';
import { BadRequestError } from "../errors/AppError";

export const validate = (schema: z.ZodAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
    });

    if (!result.success) {
        const message = result.error.issues.map((e) => e.message).join(", ");
        return next(new BadRequestError(message));
    }

    next();
}