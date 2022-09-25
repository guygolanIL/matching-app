import { Request, Response } from "express";

const refreshTokens = [];

export function logout(req: Request, res: Response) {
    //TODO revoke refresh token
    throw new Error("implement me");
}