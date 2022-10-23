import { Request, Response } from "express";
import { z } from "zod";
import * as userService from "../../../services/user-service";
import { createApiResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import { hashPassword } from "../../../util/hash";

export const registerRequestSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string()
    }).refine((ctx) => ctx.confirmPassword === ctx.password, { message: 'Passwords must be identical' })
});
type RegisterPayloadBody = z.infer<typeof registerRequestSchema>['body'];
export async function register(req: Request, res: Response) {
    const { email, password } = req.body as RegisterPayloadBody;

    const alreadyExistingUser = await userService.findByEmail(email);

    if (alreadyExistingUser) {
        throw new UserAlreadyExistsError(email);
    }

    const hashedPassword = await hashPassword(password);
    const user = await userService.create(email, hashedPassword);

    res.status(201).json(createApiResponse({ id: user.id }));
}


export class UserAlreadyExistsError extends AbstractApplicationError {
    statusCode: number = 400;
    message: string;

    constructor(email: string) {
        super();
        this.message = `User with email ${email} already exists`;
    }
}