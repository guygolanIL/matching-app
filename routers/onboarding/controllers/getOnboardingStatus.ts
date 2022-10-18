import { Request, Response } from "express";

import * as userService from '../../../services/user-service';
import { createApiResponse } from "../../../util/api/response";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import { ProfileNotFoundError } from "../../profile/controllers/getPrivateProfile";

export async function getOnboardingStatus(req: Request, res: Response) {
    const { id: userId } = getSessionUser(req);
    const profile = await userService.findPrivateUserProfile(userId);

    if (!profile) throw new ProfileNotFoundError(userId);

    return res.json(createApiResponse({ status: profile?.onboardingStatus }))
}