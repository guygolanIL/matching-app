import { OnboardingStatus, ProfileImage, UserProfile } from '@prisma/client';
import { Request, Response } from 'express';
import { networkInterfaces } from 'os';
import { z } from 'zod';

import * as userService from '../../../services/user-service';
import { createApiResponse } from '../../../util/api/response';
import { getSessionUser } from '../../../util/middlewares/isAuthenticated';
import { ProfileNotFoundError } from './getPrivateProfile';

function assertOnboardingStatus(
    currentProfile: UserProfile & { profileImage: ProfileImage | null },
    updateParams: { name: string },
): OnboardingStatus {
    function inProgressAssertion() {
        return Boolean(updateParams.name);
    }

    function completedAssertion() {
        return Boolean(currentProfile.profileImage?.url) && inProgressAssertion();
    }

    if (completedAssertion()) {
        return 'COMPLETED';
    }

    if (inProgressAssertion()) {
        return 'IN_PROGRESS';
    }

    return 'INITIAL';
}

export const updatePrivateProfileRequestSchema = z.object({
    body: z.object({
        name: z.string().min(1).refine((name) => name.replaceAll(' ', '') !== '', { message: 'Invalid name' }),
    }),
});
type UpdateProfileRequestBody = z.infer<typeof updatePrivateProfileRequestSchema>['body'];
export async function updatePrivateProfile(req: Request, res: Response) {
    const user = getSessionUser(req);
    const profileParams = req.body as UpdateProfileRequestBody;

    let profile = await userService.findPrivateUserProfile(user.id);

    if (!profile) throw new ProfileNotFoundError(user.id);

    let onboardingStatus: OnboardingStatus = assertOnboardingStatus(profile, profileParams);

    const updatedProfile = await userService.updatePrivateUserProfile(
        user.id,
        {
            ...profileParams,
            onboardingStatus
        }
    );

    return res.json(createApiResponse(updatedProfile));
}
