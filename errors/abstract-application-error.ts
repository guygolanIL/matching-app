import { ApiErrorResponse } from "./error-handler";

export abstract class AbstractApplicationError extends Error {
    abstract statusCode: number;
    abstract message: string;

    constructor() {
        super();
        Object.setPrototypeOf(this, AbstractApplicationError.prototype);
    }

    public toJson(): ApiErrorResponse {
        return {
            issues: [{
                message: this.message
            }]
        };
    }
}