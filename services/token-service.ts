import { User } from "@prisma/client";

import { SecretError } from "../util/errors/secret-error";
import { createJwt, UserJwtPayload, verifyJwt } from "../util/jwt";
import { TokenCache } from "../data/redis";

async function verify(token: string, secret?: string): Promise<UserJwtPayload | undefined> {
    if (!secret) throw new SecretError();

    const userPayload: UserJwtPayload | undefined = await verifyJwt(
        token,
        secret
    );

    return userPayload;
}

export async function create({ email, id }: User): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshJwtSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !refreshJwtSecret) throw new SecretError();

    const accessToken = createJwt({ email }, { secret: jwtSecret, expiresIn: '30m' });
    const refreshToken = createJwt({ email }, { secret: refreshJwtSecret, expiresIn: '7d' });

    await TokenCache.saveToken(id, refreshToken);

    return {
        accessToken,
        refreshToken
    };
}

export async function verifyToken(token: string): Promise<UserJwtPayload | undefined> {
    const secret = process.env.JWT_SECRET;
    const tokenPayload = await verify(token, secret);

    return tokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<UserJwtPayload | undefined> {
    const secret = process.env.JWT_REFRESH_SECRET;
    const tokenPayload = await verify(token, secret);

    return tokenPayload;
}