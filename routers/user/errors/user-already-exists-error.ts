import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";

export class UserAlreadyExistsError extends AbstractApplicationError {
    statusCode: number = 400;
    message: string;

    constructor(email: string) {
        super();
        this.message = `user with email ${email} already exists`;
    }

}