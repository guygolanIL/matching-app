
import { Request, Response } from "express";
import { z } from "zod";

import * as tokenService from '../../../services/token-service'
import * as userService from '../../../services/user-service';
import { createApiResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import { TokenExpiredError } from "jsonwebtoken";
import { UserJwtPayload } from "../../../util/jwt";

export const refreshRequestSchema = z.object({
    body: z.object({
        refreshToken: z.string()
    })
});
type RefreshTokenRequestPayload = z.infer<typeof refreshRequestSchema>['body'];
export async function refresh(req: Request, res: Response) {
    const { refreshToken } = req.body as RefreshTokenRequestPayload;

    let userPayload: UserJwtPayload | undefined;
    try {
        userPayload = await tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new RefreshTokenValidationError();
        }
    }

    if (!userPayload) {
        console.log(`bad user payload in refresh token`, userPayload);
        throw new Error('failed to parse jwt token');
    }

    const user = await userService.findByEmail(userPayload.email);

    if (!user) {
        throw new Error(`failed to find user with email ${userPayload.email}`);
    }

    const savedRefreshToken = await tokenService.getTokenFromCache(user.id);

    if (refreshToken !== savedRefreshToken) {
        console.log(`refresh token sent ${refreshToken} is different from saved refresh token ${savedRefreshToken}`);
        throw new RefreshTokenValidationError();
    }

    await tokenService.revokeTokenFromCache(user.id);

    const { accessToken, refreshToken: newRefreshToken } = await tokenService.create(user);

    console.log('refreshed token', user.email);
    res.status(201).json(createApiResponse({
        accessToken,
        refreshToken: newRefreshToken,
    }));
}

class RefreshTokenValidationError extends AbstractApplicationError {
    statusCode: number = 401;
    message: string = 'Login error';
}