import { Request, Response } from "express";

import * as tokenService from '../../../services/token-service';
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";


export async function logout(req: Request, res: Response) {
    const user = getSessionUser(req);
    await tokenService.revokeTokenFromCache(user.id);

    res.sendStatus(200);
}