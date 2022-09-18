import { Request, Response } from "express";
import { getSessionUser } from "../../../auth";
import * as userService from "../../../data/user/user-service";

export async function feed(req: Request, res: Response) {
    const user = getSessionUser(req);
    const distance = 10;
    const users = await userService.findUsersByDistance({
        userEmail: user.email,
        distanceLimit: distance,
        location: { longitude: user.longitude, latitude: user.latitude },
    });

    res.json({ data: users });
}