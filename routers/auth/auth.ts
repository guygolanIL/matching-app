import { Router } from "express";

import { validateRequest } from "../../util/middlewares/validate-request";
import { login, loginRequestSchema } from "./controllers/login";
import { register, registerRequestSchema } from "./controllers/register";
import { logout } from "./controllers/logout";
import { isAuthenticated } from "../../util/middlewares/isAuthenticated";
import { refresh } from "./controllers/refresh";
import { googleLogin, googleLoginRequestSchema } from "./controllers/googleLogin";

export const authRouter = Router();

authRouter.post(
    '/login/password',
    validateRequest(loginRequestSchema),
    login,
);

authRouter.post(
    '/register/password',
    validateRequest(registerRequestSchema),
    register,
);

authRouter.delete(
    '/logout',
    isAuthenticated,
    logout,
);

authRouter.post(
    '/refresh',
    refresh
);

authRouter.post(
    '/login/google',
    validateRequest(googleLoginRequestSchema),
    googleLogin
)
