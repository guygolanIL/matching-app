import { Request, Response } from "express";
import { z } from "zod";
import * as userService from "../../../data/user/user-service";
import { createDataResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import { hashPassword } from "../../../util/hash";

export const registerRequestSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    })
});
export async function register(req: Request, res: Response) {
    const { email, password } = req.body;

    const alreadyExistingUser = await userService.findByEmail(email);

    if (alreadyExistingUser) {
        throw new UserAlreadyExistsError(email);
    }

    const hashedPassword = await hashPassword(password);
    const user = await userService.create(email, hashedPassword);

    res.status(201).json(createDataResponse({ id: user.id }));
}


export class UserAlreadyExistsError extends AbstractApplicationError {
    statusCode: number = 400;
    message: string;

    constructor(email: string) {
        super();
        this.message = `user with email ${email} already exists`;
    }
}