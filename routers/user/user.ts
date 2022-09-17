import { Router } from "express";
import passport from "passport";
import z from 'zod';
import { isAuthenticated } from "../../auth";
import { userService } from "../../data/user/user-service";
import { validateRequest } from "../../util/middlewares/validate-request";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { hashPassword } from "../../util/hash";

export const userRouter = Router();

const schema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
});

userRouter.post(
    '/login/password',
    validateRequest(schema),
    passport.authenticate('local'), (req, res) => {
        res.status(200).send('authenticated');
    }
);

userRouter.post(
    '/register/password',
    validateRequest(schema),
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
