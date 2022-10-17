import { Request, Response } from "express";
import { z } from "zod";

import * as googleClient from '../../../util/google/googleClient';
import * as userService from '../../../services/user-service';
import * as tokenService from '../../../services/token-service';
import { createApiResponse } from "../../../util/api/response";

export const googleLoginRequestSchema = z.object({
    body: z.object({
        googleAccessToken: z.string(),
        longitude: z.number(),
        latitude: z.number(),
    }),
});
type GoogleLoginRequestBody = z.infer<typeof googleLoginRequestSchema>['body'];
export async function googleLogin(req: Request, res: Response) {
    const { googleAccessToken, latitude, longitude } = req.body as GoogleLoginRequestBody;

    const googleUser: googleClient.GoogleUserInfo = await googleClient.getUser(googleAccessToken);

    let user = await userService.findByEmail(googleUser.email);

    if (!user) {
        user = await userService.create(googleUser.email);
    }

    const { accessToken, refreshToken } = await tokenService.create(user);

    await userService.updateLocation(user.email, { latitude, longitude });

    return res.status(200).json(createApiResponse({
        accessToken,
        refreshToken
    }));
}