import { Request, Response } from "express";
import * as userService from "../../../data/user/user-service";
import { createDataResponse } from "../../../util/api/response";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";

export async function feed(req: Request, res: Response) {
    const user = getSessionUser(req);
    const distance = 10;
    const users = await userService.findUsersProximateToUser({
        user,
        distanceLimit: distance,
    });

    res.status(200).json(createDataResponse(users));
}