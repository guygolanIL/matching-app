import { Router } from "express";
import passport from "passport";
import z from 'zod';
import { isAuthenticated } from "../../auth";
import { userService } from "../../data/user/user-service";
import { validateRequest } from "../../util/middlewares/validate-request";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { hashPassword } from "../../util/hash";
import { prismaClient } from "../../data";

export const userRouter = Router();

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
        longtitude: z.number(),
        latitude: z.number(),
    })
});

userRouter.post(
    '/login/password',
    validateRequest(loginSchema),
    passport.authenticate('local'),
    async (req, res) => {
        const { latitude, longtitude, email } = req.body;
        await userService.updateLocation(email, { longtitude, latitude });
        res.status(200).send('authenticated');
    }
);

const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    })
});

userRouter.post(
    '/register/password',
    validateRequest(registerSchema),
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

userRouter.get(
    '/privateData',
    isAuthenticated,
    (req, res) => {
        res.json({
            private: req.session
        });
    }
);
