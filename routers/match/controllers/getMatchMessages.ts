import { Request, Response } from "express";

import * as matchingService from '../../../services/match-service';
import { createApiResponse } from "../../../util/api/response";

export async function getMatchMessages(req: Request, res: Response) {
    const { matchId } = req.params;

    const messages = await matchingService.findMatchMessages(Number(matchId));

    return res.json(createApiResponse(messages));
}
