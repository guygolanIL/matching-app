import { Application } from "express";
import session from "express-session";
import passport from "passport";
import connectPostgres from 'connect-pg-simple';

const PostgresStore = connectPostgres(session);

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
