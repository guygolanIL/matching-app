import { Request, Response } from "express";
import { z } from "zod";

import * as userService from '../../../services/user-service';
import { createApiResponse } from "../../../util/api/response";
import { ProfileNotFoundError } from "./getPrivateProfile";

export const getPublicProfileRequestSchema = z.object({
    params: z.object({
        userId: z.preprocess(
            (id) => parseInt(z.string().parse(id)),
            z.number()
        )
    }),
});
export async function getPublicProfile(req: Request, res: Response) {
    const { userId } = req.params;

    const id: number = Number(userId);

    const profile = await userService.findPublicUserProfile(id);

    if (!profile) throw new ProfileNotFoundError(id);

    return res.json(createApiResponse({
        userId: profile.userId,
        profileImage: profile.profileImage,
    }));
}