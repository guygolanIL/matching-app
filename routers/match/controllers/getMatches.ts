import { Request, Response } from "express";

import { getSessionUser } from "../../../util/middlewares/isAuthenticated";
import * as matchingService from '../../../services/match-service';
import { createApiResponse } from "../../../util/api/response";
import { PublicProfileInfo } from "../../../services/user-service";
import { getMatchee } from "../util/matchee";

type MatchInfo = { id: number; matchedWith: PublicProfileInfo };

export async function getMatches(req: Request, res: Response) {

    const user = getSessionUser(req);
    const matches = await matchingService.findMatches(user.id);

    const matchInfos: Array<MatchInfo> = matches.map((match) => {
        const matchedUser = getMatchee(user.id, match);
        if (!matchedUser.userProfile) console.error('matched with user without profile');
        return {
            id: match.id,
            matchedWith: {
                userId: matchedUser.id,
                name: matchedUser.userProfile!.name,
                profileImage: matchedUser.userProfile?.profileImage || null,
            }
        };
    });

    return res.json(createApiResponse(matchInfos));
}