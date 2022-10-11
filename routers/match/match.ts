import { Router } from "express";

import { validateRequest } from "../../util/middlewares/validate-request";
import { createMessage, createMessageRequestSchema } from "./controllers/createMessage";
import { createMatchRequestSchema } from './util/schema';
import { getMatches } from "./controllers/getMatches";
import { getMatchMessages } from "./controllers/getMatchMessages";

export const matchRouter = Router();

matchRouter.get(
    '/',
    getMatches
);

matchRouter.get(
    '/:matchId/message',
    validateRequest(createMatchRequestSchema()),
    getMatchMessages
);

matchRouter.post(
    '/:matchId/message',
    validateRequest(createMatchRequestSchema(createMessageRequestSchema)),
    createMessage
);
