import { Router } from "express";

import { validateRequest } from "../../util/middlewares/validate-request";
import { getPrivateProfile } from "./controllers/getPrivateProfile";
import { getPublicProfile, getPublicProfileRequestSchema } from "./controllers/getPublicProfile";
import { updatePrivateProfile, updatePrivateProfileRequestSchema } from "./controllers/updatePrivateProfile";
import { uploadImage, uploadImageRequestSchema } from "./controllers/uploadImage";

export const profileRouter = Router();

profileRouter.post(
    '/image',
    validateRequest(uploadImageRequestSchema),
    uploadImage
);

profileRouter.get(
    '/',
    getPrivateProfile,
);

profileRouter.put(
    '/',
    validateRequest(updatePrivateProfileRequestSchema),
    updatePrivateProfile,
)

profileRouter.get(
    '/:userId',
    validateRequest(getPublicProfileRequestSchema),
    getPublicProfile,
);