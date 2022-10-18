import { OnboardingStatus, ProfileImage, UserProfile } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';

import * as userService from '../../../services/user-service';
import { createApiResponse } from '../../../util/api/response';
import { getSessionUser } from '../../../util/middlewares/isAuthenticated';
import { createApiSchema } from '../../../util/middlewares/validate-request';
import { ProfileNotFoundError } from './getPrivateProfile';

export const updateProfileParams = z.object({
    name: z.string().min(1).refine((name) => name.replaceAll(' ', '') !== '', { message: 'Invalid name' }),
});

export const updatePrivateProfileRequestSchema = createApiSchema(updateProfileParams);

type UpdateProfileRequestBody = z.infer<typeof updatePrivateProfileRequestSchema>['body'];
export async function updatePrivateProfile(req: Request, res: Response) {
    const user = getSessionUser(req);
    const profileParams = req.body as UpdateProfileRequestBody;

    let profile = await userService.findPrivateUserProfile(user.id);

    if (!profile) throw new ProfileNotFoundError(user.id);

    const updatedProfile = await userService.updatePrivateUserProfile(
        user.id,
        {
            ...profileParams,
        }
    );

    return res.json(createApiResponse(updatedProfile));
}
