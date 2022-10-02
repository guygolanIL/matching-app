import { JwtPayload, sign, verify } from "jsonwebtoken";

export type UserJwtPayload = { email: string } & JwtPayload;
type TimeOption = 'h' | 'd' | 'm' | 's';
type ExpiresIn<T extends number> = `${T}${TimeOption}`;

export function createJwt<T extends number>(user: UserJwtPayload, options: { secret: string, expiresIn: ExpiresIn<T> }) {
    const { expiresIn, secret } = options;
    return sign(user, secret, { expiresIn });
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