import { Request, Response } from "express";
import { z } from "zod";

import * as matchingService from '../../../services/match-service';
import { createApiResponse } from "../../../util/api/response";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import { getMatchee } from "../util/matchee";
import { AbstractApplicationError } from "../../../util/errors/abstract-application-error";
import { StatusCode } from "../../../util/errors/status-code";
import { SocketContext } from "../../../socket/SocketContext";

export const createMessageRequestSchema = z.object({
    content: z.string(),
});
type CreateMessageBody = z.infer<typeof createMessageRequestSchema>;
export async function createMessage(req: Request, res: Response) {
    const user = getSessionUser(req);
    const { matchId } = req.params;
    const { content } = req.body as CreateMessageBody;

    const matchIdNumber = Number(matchId);

    const message = await matchingService.createMessage(matchIdNumber, content, user.id);

    const match = await matchingService.findMatch(matchIdNumber);

    if (!match) throw new MatchNotFoundError(matchIdNumber)

    const matchee = getMatchee(user.id, match);
    SocketContext.emitIfConnected(matchee.id, 'messagesUpdated');

    return res.json(createApiResponse(message));
}

class MatchNotFoundError extends AbstractApplicationError {
    statusCode = StatusCode.BadRequest;
    message;

    constructor(matchId: number) {
        super();
        this.message = `Match ${matchId} not found`
    }
}