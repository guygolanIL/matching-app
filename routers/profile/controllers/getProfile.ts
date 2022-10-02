import { UserProfile } from '@prisma/client';
import { Request, Response } from 'express';

import * as userService from '../../../services/user-service';
import { createApiResponse } from '../../../util/api/response';
import { AbstractApplicationError } from '../../../util/errors/abstract-application-error';
import { getSessionUser } from '../../../util/middlewares/isAuthenticated';

export async function getProfile(req: Request, res: Response) {
    const user = getSessionUser(req);

    const profile: UserProfile | null = await userService.findUserProfile(user.id);

    if (!profile) throw new ProfileNotFoundError(user.id);

    res.json(createApiResponse(profile));
}

class ProfileNotFoundError extends AbstractApplicationError {
    statusCode: number = 400;
    message: string;

    constructor(userId: number) {
        super();
        this.message = `failed to find profile of user ${userId}`;
    }
}