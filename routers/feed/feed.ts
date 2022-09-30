import { Router } from "express";

import { validateRequest } from "../../util/middlewares/validate-request";
import { classify, classifyRequestSchema } from "./controllers/classify";
import { feed } from "./controllers/feed";

export const feedRouter = Router();

feedRouter.post(
    '/classify',
    validateRequest(classifyRequestSchema),
    classify,
);

feedRouter.get(
    '*',
    feed,
);