import { Request, Response } from "express";
import { z } from "zod";
import * as userService from '../../../data/user/user-service';

export const loginRequestSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
        longtitude: z.number(),
        latitude: z.number(),
    })
})

export async function login(req: Request, res: Response) {
    const { latitude, longitude, email } = req.body;
    await userService.updateLocation(email, { longitude, latitude });
    res.status(200).send('authenticated');
}