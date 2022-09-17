import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy } from "passport-local";

const LocalStrategy = Strategy;

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: '123', username: 'dasdas' });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user as Express.User);
    });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    done(null, { yay: 'yoof' });
}));



/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send("not logged in");
};