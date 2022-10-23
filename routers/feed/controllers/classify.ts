import { Attitude, UserClassification } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

import * as userService from "../../../services/user-service";
import { SocketContext } from "../../../socket/SocketContext";
import { ApiResponse, createApiResponse } from "../../../util/api/response";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import { MatchInfo } from "../../match/controllers/getMatches";

export const classifyRequestSchema = z.object({
    body: z.object({
        classifiedUserId: z.number(),
        attitude: z.enum([Attitude.POSITIVE, Attitude.NEGATIVE]),
    }),
});
type ClassifyRequestBodySchema = z.infer<typeof classifyRequestSchema>['body'];

type ResponseBody = ApiResponse<{
    classification: UserClassification,
    matchedUserId?: number;
}>;
export async function classify(req: Request, res: Response) {
    const requestPayload: ClassifyRequestBodySchema = req.body;
    const { attitude, classifiedUserId } = requestPayload;
    const userId = getSessionUser(req).id;
    const result = await userService.classifyUser({
        userId,
        attitude,
        targetUserId: classifiedUserId,
        onMatchCreated(match, matcheeUserId) {
            userService.findPublicUserProfile(userId).then((info => {
                const matchInfo: MatchInfo = {
                    id: match.id,
                    matchedWith: {
                        name: info!.name,
                        userId: info!.userId,
                        profileImage: info!.profileImage,
                    },
                };
                SocketContext.emitIfConnected(matcheeUserId, 'matchCreated', matchInfo);
            }));
        }
    });

    const response: ResponseBody = createApiResponse({
        classification: result.classification,
        matchedUserId: result.match?.initiatingUserId
    });

    return res.status(201).json(response);
}