import { User } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

import * as tokenService from '../../../services/token-service';
import * as userService from '../../../services/user-service';
import { TokenCache } from "../../../data/redis";
import { createApiResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import { verifyPassword } from "../../../util/hash";

async function validate(email: string, password: string): Promise<User> {
    const foundUser = await userService.findByEmail(email);

    if (!foundUser) throw new LoginValidationError();

    const correctPass: boolean = await verifyPassword(password, foundUser.password);
    if (!correctPass) throw new LoginValidationError();

    return foundUser;
}

export const loginRequestSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
        longitude: z.number(),
        latitude: z.number(),
    })
});
type LoginRequestPayload = z.infer<typeof loginRequestSchema>['body'];
export async function login(req: Request, res: Response) {
    const { latitude, longitude, email, password } = req.body as LoginRequestPayload;

    const user = await validate(email, password);

    const { accessToken, refreshToken } = await tokenService.create(user);

    await TokenCache.saveToken(user.id, refreshToken);

    await userService.updateLocation(email, { longitude, latitude });

    res.status(201).json(createApiResponse({
        accessToken,
        refreshToken,
    }));
}

class LoginValidationError extends AbstractApplicationError {
    statusCode: number = 401;
    message: string = 'No user with that email/password combination';
}