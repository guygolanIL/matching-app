import { Router } from "express";
import passport from "passport";
import z from 'zod';
import { isAuthenticated } from "../../auth";
import { userService } from "../../data/user/user-service";
import { validateRequest } from "../../util/middlewares/validate-request";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { hashPassword } from "../../util/hash";
import { Attitude } from "@prisma/client";

export const userRouter = Router();

userRouter.post(
    '/login/password',
    validateRequest(z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string(),
            longtitude: z.number(),
            latitude: z.number(),
        })
    })),
    passport.authenticate('local'),
    async (req, res) => {
        const { latitude, longtitude, email } = req.body;
        await userService.updateLocation(email, { longtitude, latitude });
        res.status(200).send('authenticated');
    }
);

userRouter.post(
    '/register/password',
    validateRequest(z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string(),
        })
    })),
    async (req, res) => {
        const { email, password } = req.body;

        const alreadyExistingUser = await userService.findByEmail(email);

        if (alreadyExistingUser) {
            throw new UserAlreadyExistsError(email);
        }

        const hashedPassword = await hashPassword(password);
        const user = await userService.create(email, hashedPassword);
        res.status(201).send({ data: { id: user.id } });
    }
);

userRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).send('session terminated');
    });
});


const classifyRequestBodySchema = z.object({
    classifiedUserId: z.number(),
    attitude: z.enum([Attitude.POSITIVE, Attitude.NEGATIVE]),
});
type ClassifyRequestBody = z.infer<typeof classifyRequestBodySchema>;
userRouter.post(
    '/classify',
    isAuthenticated,
    validateRequest(z.object({
        body: classifyRequestBodySchema
    })),
    async (req, res) => {
        const requestBody: ClassifyRequestBody = req.body;
        const { attitude, classifiedUserId } = requestBody;

        const classification = await userService.classifyUser({
            userId: req.user!.id,
            attitude,
            targetUserId: classifiedUserId
        });

        res.status(201).json({ data: classification });
    }
);