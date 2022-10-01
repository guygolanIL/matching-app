import { config } from 'dotenv';
config();
require('express-async-errors');
import express, { Application, json } from 'express';
import cors from 'cors';

import { authRouter } from './routers/auth/auth';
import { errorHandler } from './util/errors/error-handler';
import { profileRouter } from './routers/profile/profile';
import { feedRouter } from './routers/feed/feed';
import { isAuthenticated } from './util/middlewares/isAuthenticated';

export const app: Application = express();

app.use(cors());
app.use(json({ limit: 1000 * 1000 * 50 }));

app.use("/auth", authRouter);
app.use('/profile', isAuthenticated, profileRouter);
app.use('/feed', isAuthenticated, feedRouter);

app.use(errorHandler);
