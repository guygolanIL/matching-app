import { Application, NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import connectPostgres from 'connect-pg-simple';
import { Strategy } from "passport-local";
import { prismaClient } from "../data";
import { User } from "@prisma/client";
import { verifyPassword } from "../util/hash";

const PostgresStore = connectPostgres(session);
const LocalStrategy = Strategy;

passport.serializeUser(function (user, cb) {
    const { email, id } = user as SessionUser;
    process.nextTick(function () {
        cb(null, { id, email });
    });
});

passport.deserializeUser(function (user: User, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    prismaClient.user.findUnique({
        where: {
            email,
        }
    })
        .then(async (user: User | null) => {
            if (!user) {
                console.warn(`no user found with email ${email}`);
                return done(null);
            }
            const verified = await verifyPassword(password, user!.password);
            if (verified) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(e => {
            return done(e);
        });
}));

export function setupAuth(app: Application) {
    app.use(session({
        store: new PostgresStore({
            createTableIfMissing: true
        }),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
    }));
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));
}

export type SessionUser = Pick<User, "email" | "id">;
declare global {
    namespace Express {
        interface User extends SessionUser { }
    }
}

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send("not logged in");
};