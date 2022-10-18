import { Router } from "express";

import { validateRequest } from "../../util/middlewares/validate-request";
import { getOnboardingStatus } from "./controllers/getOnboardingStatus";
import { updateOnboardingStatus, updateOnboardingStatusSchema } from "./controllers/updateOnboardingStatus";

export const onboardingRouter = Router();

onboardingRouter.put(
    '/',
    validateRequest(updateOnboardingStatusSchema),
    updateOnboardingStatus,
);

onboardingRouter.get(
    '/',
    getOnboardingStatus,
);