import { Request, Response } from "express";

import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import * as matchingService from '../../../services/match-service';
import { createApiResponse } from "../../../util/api/response";
import { PublicProfileInfo } from "../../../services/user-service";
import { getMatcheeUserId } from "../util/matchee";

export type MatchInfo = { id: number; matchedWith: PublicProfileInfo };

export async function getMatches(req: Request, res: Response) {

    const user = getSessionUser(req);
    const matches = await matchingService.findMatches(user.id);

    const matchInfos: Array<MatchInfo> = matches.map((match) => {
        const matchedUserId = getMatcheeUserId(user.id, match);
        const matchedUser = matchedUserId === match.creatingUser.id ? match.creatingUser : match.initiatingUser;
        const matchInfo: MatchInfo = {
            id: match.id,
            matchedWith: {
                name: matchedUser.userProfile!.name,
                userId: matchedUser.id,
                profileImage: matchedUser.userProfile!.profileImage,
            }
        };

        return matchInfo;
    });

    return res.json(createApiResponse(matchInfos));
}