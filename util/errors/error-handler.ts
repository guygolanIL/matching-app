import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AbstractApplicationError } from "./abstract-application-error";


export type ApiErrorResponse = {
    issues: Array<{
        message: string;
        field?: string | number;
    }>;
}

function zodErrorParser(error: ZodError): ApiErrorResponse {
    return {
        issues: error.issues.map(issue => ({
            message: issue.message,
            field: issue.path[issue.path.length - 1]
        }))
    }
}

function generalErrorParser(e: Error): ApiErrorResponse {
    return {
        issues: [{
            message: 'Sorry, unknown error occured',
        }],
    };
}

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {

    if (error instanceof ZodError) {
        console.info(error);
        return res.status(400).json(zodErrorParser(error));
    }

    if (error instanceof AbstractApplicationError) {
        console.info(error);
        return res.status(error.statusCode).json(error.toJson());
    }

    console.error(error);
    return res.status(500).json(generalErrorParser(error));
}