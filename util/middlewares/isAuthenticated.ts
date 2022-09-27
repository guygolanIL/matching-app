import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../data/prisma-client";
import { SecretError } from "../errors/secret-error";
import { UserJwtPayload, verifyJwt } from "../jwt";
import { User } from "@prisma/client";
import { AbstractApplicationError } from "../errors/abstract-application-error";

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
    console.log("received token: " + token);
    if (!token) {
        throw new AuthError();
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new SecretError();

        const userPayload: UserJwtPayload | undefined = await verifyJwt(
            token,
            secret
        );

        if (!userPayload) {
            throw new Error('failed to find user');
        }

        const user = await prismaClient.user.findUnique({
            where: {
                email: userPayload.email
            }
        });

        if (user) {
            const { email, id, latitude, longitude, name, registeredAt } = user;
            req.user = {
                email,
                id,
                latitude,
                longitude,
                name,
                registeredAt
            };
            console.log("authenticated user", user.email);
            next();
        }

    } catch (error) {
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
    message: string = 'authentication failed';

}