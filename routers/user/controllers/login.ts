import { Request, Response } from "express";
import { z } from "zod";
import * as userService from '../../../data/user/user-service';
import { createMessageResponse } from "../../../util/api/response";

export const loginRequestSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
        longitude: z.number(),
        latitude: z.number(),
    })
})

type LoginRequestPayload = z.infer<typeof loginRequestSchema>['body'];

export async function login(req: Request, res: Response) {
    const { latitude, longitude, email } = req.body as LoginRequestPayload;
    await userService.updateLocation(email, { longitude, latitude });

    res.status(200).json(createMessageResponse('authenticated'));
}