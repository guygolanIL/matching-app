import { ImageType } from "@prisma/client";
import { Request, Response } from "express";
import z from 'zod';

import * as userService from '../../../services/user-service';
import { createApiResponse } from "../../../util/api/response";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import * as imageStorage from '../../../util/image-storage';
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";

export const uploadImageParams = z.object({
    type: z.enum([ImageType.png, ImageType.jpeg]),
    base64: z.string(),
});
export const uploadImageRequestSchema = z.object({
    body: uploadImageParams,
});
type UploadImageRequestBodySchema = z.infer<typeof uploadImageRequestSchema>['body'];
export async function uploadImage(req: Request, res: Response) {
    const { base64, type }: UploadImageRequestBodySchema = req.body;

    const user = getSessionUser(req);
    const url = await imageStorage.upload({ base64, type, folder: 'avatars' });

    const profile = await userService.updateProfileImage(user.id, url, type);

    if (!profile.profileImage) throw new ProfileImageUploadError();

    res.status(201).json(createApiResponse(profile.profileImage));
}

class ProfileImageUploadError extends AbstractApplicationError {
    statusCode: number = 400;
    message: string = 'failed to upload profile image';
}