import { config } from 'dotenv';
config();
import express, { Application, json } from 'express';
import { } from 'redis';
import passport from 'passport';
import { db } from './data';
import { loginRouter } from './routers/login';
import { redisClient } from './auth/config/redis';
import { isAuthenticated } from './auth/config/passport';
import { protectedRouter } from './routers/protectedRouter';
import connectRedis from 'connect-redis';
import session from 'express-session';

const port = process.env.PORT || 3000;
const app: Application = express();

const RedisStore = connectRedis(session);

app.use(session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(json());

app.use("/protected", isAuthenticated, protectedRouter);
app.use("/login", loginRouter);

app.listen(port, () => {
    redisClient.connect()
        .then(() => console.log('connected to redis'))
        .then(() => db.$connect())
        .catch(console.error)
        .then(() => console.log('app started on port ' + port));
});
