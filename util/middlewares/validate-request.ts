import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from 'zod';

export function validateRequest(schema: AnyZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        schema.parse(req);
        next();
    }
}