import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAynsc = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => (req, res, next) => {
    fn(req, res, next).catch(next);
}