import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export interface RequestWithId extends Request {
    requestId: string;
}

export function requestIdMiddleware(req: RequestWithId, res: Response, next: NextFunction) {
    req.requestId = (req.headers["x-request-id"] as string) || uuidv4();
    res.setHeader("x-header-id", req.requestId);
    next();
}