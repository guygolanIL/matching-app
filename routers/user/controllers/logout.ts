import { Request, Response } from "express";

import { TokenCache } from "../../../data/redis";
import { createApiResponse } from "../../../util/api/response";
import { getRequestToken, getSessionUser } from "../../../util/middlewares/isAuthenticated";


export async function logout(req: Request, res: Response) {
    const user = getSessionUser(req);
    await TokenCache.revoke(user.id);

    res.status(200).json(createApiResponse({
        yay: 'yoog'
    }));
}