import { Attitude } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import * as userService from "../../../data/user/user-service";
import { getSessionUser } from "../../../util/middlewares/isAuthenticated";

export const classifyRequestSchema = z.object({
    body: z.object({
        classifiedUserId: z.number(),
        attitude: z.enum([Attitude.POSITIVE, Attitude.NEGATIVE]),
    }),
});
type ClassifyRequestBodySchema = z.infer<typeof classifyRequestSchema>['body'];

export async function classify(req: Request, res: Response) {
    const requestPayload: ClassifyRequestBodySchema = req.body;
    const { attitude, classifiedUserId } = requestPayload;

    const classification = await userService.classifyUser({
        userId: getSessionUser(req).id,
        attitude,
        targetUserId: classifiedUserId
    });

    res.status(201).json({ data: classification });
}