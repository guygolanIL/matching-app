
import { Request, Response } from "express";
import { z } from "zod";

import * as tokenService from '../../../services/token-service'
import * as userService from '../../../services/user-service';
import { TokenCache } from "../../../data/redis";
import { createApiResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";

export const refreshRequestSchema = z.object({
    body: z.object({
        refreshToken: z.string()
    })
});
type RefreshTokenRequestPayload = z.infer<typeof refreshRequestSchema>['body'];
export async function refresh(req: Request, res: Response) {
    const { refreshToken } = req.body as RefreshTokenRequestPayload;

    const userPayload = await tokenService.verifyRefreshToken(refreshToken);

    if (!userPayload) {
        throw new Error('failed to parse jwt token');
    }

    const user = await userService.findByEmail(userPayload.email);

    if (!user) {
        throw new Error('failed to find user');
    }

    const savedRefreshToken = await TokenCache.getToken(user.id);

    if (refreshToken !== savedRefreshToken) {
        throw new RefreshTokenValidationError();
    }

    await TokenCache.revokeToken(user.id);

    const { accessToken, refreshToken: newRefreshToken } = await tokenService.create(user);

    res.status(201).json(createApiResponse({
        accessToken,
        refreshToken: newRefreshToken,
    }));
}

class RefreshTokenValidationError extends AbstractApplicationError {
    statusCode: number = 401;
    message: string = 'bad refresh token';
}