import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

import * as userService from '../../services/user-service';
import * as tokenService from '../../services/token-service';
import { AbstractApplicationError } from "../errors/abstract-application-error";
import { TokenExpiredError } from "jsonwebtoken";

type SessionUser = Omit<User, 'password'>;
declare global {
    namespace Express {
        export interface Request {
            user?: SessionUser;
        }
    }
}

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = getRequestToken(req);
    if (!token) {
        throw new AuthError();
    }

    try {
        const userPayload = await tokenService.verifyToken(token);

        if (!userPayload) {
            throw new Error(`failed to find user with token ${token}`);
        }

        const user = await userService.findByEmail(userPayload.email);

        if (user) {
            const { email, id, latitude, longitude, registeredAt } = user;
            req.user = {
                email,
                id,
                latitude,
                longitude,
                registeredAt
            };
            console.log("authenticated user", user.email);
            next();
        } else {
            throw new Error('user not found');
        }

    } catch (error) {
        console.warn(error);
        if (error instanceof TokenExpiredError) {
            throw new AuthError("jwt expired");
        }
        throw new AuthError();
    }
}

export function getSessionUser(req: Request): SessionUser {
    const user: SessionUser | undefined = req.user;
    if (!user) throw Error('no user in session. verify that isAuthenticated middleware is used.');

    return user;
}

export function getRequestToken(req: Request): string | undefined {
    const authenticationHeader = req.header("Authorization"); // Bearer <TOKEN>
    const token = authenticationHeader?.split(" ")[1];

    return token;
}

class AuthError extends AbstractApplicationError {
    statusCode: number = 401;
    message: string;

    constructor(msg?: string) {
        super();
        this.message = msg || 'authentication failed';
    }
}