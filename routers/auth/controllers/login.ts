import { User } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

import { prismaClient } from "../../../data/prisma-client";
import { TokenCache } from "../../../data/redis";
import * as userService from '../../../data/user/user-service';
import { createApiResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import { SecretError } from "../../../util/errors/secret-error";
import { verifyPassword } from "../../../util/hash";
import { createJwt } from "../../../util/jwt";

async function validate(email: string, password: string): Promise<User> {
    const foundUser = await prismaClient.user.findUnique({
        where: {
            email
        }
    });

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

    const jwtSecret = process.env.JWT_SECRET;
    const refreshJwtSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !refreshJwtSecret) throw new SecretError();

    const accessToken = createJwt({ email }, { secret: jwtSecret, expirationMinutes: 60 });
    const refreshToken = createJwt({ email }, { secret: refreshJwtSecret, expirationMinutes: 60 });

    await TokenCache.saveRefreshToken(user.id, refreshToken);

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