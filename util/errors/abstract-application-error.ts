import { ApiErrorResponse } from "./error-handler";
import { StatusCode } from "./status-code";

/**
 * Warning: this is a user facing error! 
 */
export abstract class AbstractApplicationError extends Error {
    abstract statusCode: StatusCode;
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