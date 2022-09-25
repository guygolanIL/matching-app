import { JwtPayload, sign, verify } from "jsonwebtoken";

export type UserJwtPayload = { email: string } & JwtPayload;

export function createJwt(user: UserJwtPayload, options: { secret: string, expirationMinutes: number }) {
    const expiresIn = options.expirationMinutes * 60;
    return sign(user, options.secret, { expiresIn });
}

export function verifyJwt(jwt: string, secret: string): Promise<UserJwtPayload | undefined> {
    return new Promise<UserJwtPayload | undefined>((res, rej) => {
        verify(jwt, secret, (err, payload) => {
            if (err) {
                rej(err);
            } else {
                res(payload as UserJwtPayload);
            }
        });
    });
}