import { Router } from "express";
import { STATUS_CODES } from "http";
import passport from "passport";
import z from 'zod';
import { isAuthenticated } from "../../auth";
import { userService } from "../../data/user/user-service";
import { validateRequest } from "../../middlewares/validate-request";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

export const userRouter = Router();

userRouter.post('/login/password', passport.authenticate('local'), (req, res) => {
    res.status(200).send('authenticated');
});

userRouter.post(
    '/register/password',
    validateRequest(z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string()
        })
    })),
    async (req, res) => {

        const { email, password } = req.body;

        const alreadyExistingUser = await userService.findByEmail(email);

        if (alreadyExistingUser) {
            throw new UserAlreadyExistsError(email);
        }

        const user = await userService.create(email, password);
        res.status(201).send({ data: { id: user.id } });

    });

userRouter.get('/privateData', isAuthenticated, (req, res) => {
    res.json({
        private: req.session
    });
});
