import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from 'zod';

export function createApiSchema<T extends AnyZodObject>(bodySchema: T) {
    return z.object({
        body: bodySchema
    });
}

export function validateRequest(schema: AnyZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        schema.parse(req);
        next();
    }
}