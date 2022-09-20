import { Request, Response } from "express";
import { getSessionUser } from "../../../auth";
import * as userService from "../../../data/user/user-service";

export async function feed(req: Request, res: Response) {
    const user = getSessionUser(req);
    const distance = 10;
    const users = await userService.findUsersProximateToUser({
        user,
        distanceLimit: distance,
    });

    res.json({ data: users });
}