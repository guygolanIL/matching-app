import { NextFunction, Request, Response, Router } from "express";
import { validateRequest } from "../../util/middlewares/validate-request";
import { login, loginRequestSchema } from "./controllers/login";
import { register, registerRequestSchema } from "./controllers/register";
import { classify, classifyRequestSchema } from "./controllers/classify";
import { feed } from "./controllers/feed";
import { logout } from "./controllers/logout";
import { isAuthenticated } from "../../util/middlewares/isAuthenticated";

export const userRouter = Router();

userRouter.post(
    '/login/password',
    validateRequest(loginRequestSchema),
    login,
);

userRouter.post(
    '/register/password',
    validateRequest(registerRequestSchema),
    register,
);

userRouter.post(
    '/logout',
    logout,
);

userRouter.post(
    '/classify',
    validateRequest(classifyRequestSchema),
    isAuthenticated,
    classify,
);

userRouter.get(
    '/feed',
    isAuthenticated,
    feed,
);