import { Request, Response } from "express";

import { TokenCache } from "../../../data/redis";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";


export async function logout(req: Request, res: Response) {
    const user = getSessionUser(req);
    await TokenCache.revokeToken(user.id);

    res.sendStatus(200);
}