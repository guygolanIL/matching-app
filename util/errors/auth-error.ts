import { AbstractApplicationError } from "./abstract-application-error";

export class AuthError extends AbstractApplicationError {
    statusCode: number = 401;
    message: string = 'authentication failed';

}