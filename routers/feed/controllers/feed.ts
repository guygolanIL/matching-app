import { Request, Response } from "express";

import * as userService from "../../../services/user-service";
import { createApiResponse } from "../../../util/api/response";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";

export async function feed(req: Request, res: Response) {
    const user = getSessionUser(req);
    const distance = 10;
    const users = await userService.findUsersProximateToUser({
        user,
        distanceLimit: distance,
    });

    const publicProfilesInfos = await userService.findUsersPublicInfo(users.map(user => user.id));

    res.status(200).json(createApiResponse(publicProfilesInfos));
}