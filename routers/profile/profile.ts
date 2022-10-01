import { Router } from "express";

import { validateRequest } from "../../util/middlewares/validate-request";
import { getProfile } from "./controllers/getProfile";
import { uploadImage, uploadImageRequestSchema } from "./controllers/uploadImage";

export const profileRouter = Router();

profileRouter.post(
    '/image',
    validateRequest(uploadImageRequestSchema),
    uploadImage
);

profileRouter.get(
    '/',
    getProfile,
);