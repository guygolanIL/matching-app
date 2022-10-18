import { Request, Response } from "express";
import { z } from "zod";

import * as userService from '../../../services/user-service';
import * as imageStorage from '../../../util/image-storage';
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import { createApiSchema } from "../../../util/middlewares/validate-request";
import { uploadImageParams } from "../../profile/controllers/uploadImage";
import { updateProfileParams } from "../../profile/controllers/updatePrivateProfile";
import { OnboardingStatus, ProfileImage, UserProfile } from "@prisma/client";
import { ProfileNotFoundError } from "../../profile/controllers/getPrivateProfile";
import { createApiResponse } from "../../../util/api/response";


type UserProfileWithAvatar = UserProfile & { profileImage: ProfileImage | null };

function assertOnboardingStatus(profile: UserProfileWithAvatar): OnboardingStatus {
    if (profile.name && profile.profileImage?.url) return 'COMPLETED';

    return 'IN_PROGRESS';
}

const updateOnboardingStatusPayload = z.object({
    step1: updateProfileParams.optional(),
    avatar: uploadImageParams.optional(),
});

export const updateOnboardingStatusSchema = createApiSchema(updateOnboardingStatusPayload);

type UpdateOnboardingRequestBody = z.infer<typeof updateOnboardingStatusSchema>['body'];

export async function updateOnboardingStatus(req: Request, res: Response) {
    const payload = req.body as UpdateOnboardingRequestBody;
    const { id: userId } = getSessionUser(req);

    let profile: UserProfileWithAvatar | null = null;

    if (payload.avatar) {
        const { base64, type } = payload.avatar;
        const url = await imageStorage.upload({ base64, type, folder: 'avatars' });
        profile = await userService.updateProfileImage(userId, url, type);
    }

    if (payload.step1) {
        const { name } = payload.step1;
        profile = await userService.updatePrivateUserProfile(userId, { name });
    }

    if (!profile) throw new ProfileNotFoundError(userId);

    const onboardingStatus = assertOnboardingStatus(profile);
    const updateProfile = await userService.updatePrivateUserProfile(userId, {
        onboardingStatus
    });

    return res.json(createApiResponse({ status: updateProfile.onboardingStatus }));
}
