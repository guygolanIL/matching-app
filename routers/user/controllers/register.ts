import { Request, Response } from "express";
import { z } from "zod";
import * as userService from "../../../data/user/user-service";
import { hashPassword } from "../../../util/hash";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

export const registerRequestSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    })
})
export async function register(req: Request, res: Response) {
    const { email, password } = req.body;

    const alreadyExistingUser = await userService.findByEmail(email);

    if (alreadyExistingUser) {
        throw new UserAlreadyExistsError(email);
    }

    const hashedPassword = await hashPassword(password);
    const user = await userService.create(email, hashedPassword);
    res.status(201).send({ data: { id: user.id } });
}