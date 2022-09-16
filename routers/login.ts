import { Router } from "express";
import passport from "passport";

export const loginRouter = Router();

loginRouter.get('/', passport.authenticate('local', {
    successReturnToOrRedirect: '/login/success',
    failureRedirect: '/login/failure',
}));


loginRouter.get('/success', (req, res) => res.send('success'));
loginRouter.get('/failure', (req, res) => res.send('failure'));