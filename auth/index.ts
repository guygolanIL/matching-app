import { Application, NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import connectPostgres from 'connect-pg-simple';
import { Strategy } from "passport-local";
import { prismaClient } from "../data";
import { User } from "@prisma/client";

const PostgresStore = connectPostgres(session);
const LocalStrategy = Strategy;

passport.serializeUser(function (user, cb) {
    const { email, id } = user as User;
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
        .then((user: User | null) => {
            if (!user) {
                console.warn(`no user found with email ${email}`);
                done(null);
            }
            done(null, user);
        })
        .catch(e => {
            done(e);
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

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send("not logged in");
};