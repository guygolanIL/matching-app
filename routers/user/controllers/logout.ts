import { Request, Response } from "express";

const refreshTokens = [];

export function logout(req: Request, res: Response) {
    //TODO revoke refresh token
    console.log('logging out')
    res.status(200).json({ yay: 'asd' });
    // throw new Error("implement me");
}