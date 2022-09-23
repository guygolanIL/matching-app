import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { validateRequest } from "../../util/middlewares/validate-request";
import { login, loginRequestSchema } from "./controllers/login";
import { register, registerRequestSchema } from "./controllers/register";
import { classify, classifyRequestSchema } from "./controllers/classify";
import { feed } from "./controllers/feed";
import { isAuthenticated } from "../../auth";
import { createMessageResponse } from "../../util/api/response";

export const userRouter = Router();

userRouter.post(
    '/login/password',
    validateRequest(loginRequestSchema),
    passport.authenticate('local', { failWithError: true }),
    login,
    function loginError(err: Error, req: Request, res: Response, next: NextFunction) {
        return res.status(401).json(createMessageResponse("failed to authenticate"));
    }
);

userRouter.post(
    '/register/password',
    validateRequest(registerRequestSchema),
    register,
);

userRouter.post(
    '/logout',
    function logout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.status(200).send('session terminated');
        });
    }
);

userRouter.post(
    '/classify',
    isAuthenticated,
    validateRequest(classifyRequestSchema),
    classify,
);

userRouter.get(
    '/feed',
    isAuthenticated,
    feed,
);