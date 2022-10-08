import { Request, Response } from "express";

import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import * as matchingService from '../../../services/match-service';
import { createApiResponse } from "../../../util/api/response";
import { ProfileInfo } from "../../../services/user-service";

type MatchInfo = ProfileInfo & { email: string };

export async function getMatches(req: Request, res: Response) {

    const user = getSessionUser(req);
    const matches = await matchingService.findMatches(user.id);

    const matchInfos = matches.map(({ creatingUser, initiatingUser }) => {
        if (creatingUser.id === user.id) {
            return initiatingUser;
        }

        return creatingUser;
    });

    const result: Array<MatchInfo> = matchInfos.map(({ id, email, userProfile }) => ({
        email,
        userId: id,
        profileImgUri: userProfile?.profileImage?.url
    }));

    return res.json(createApiResponse(result));
}