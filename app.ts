import { config } from 'dotenv';
config();
require('express-async-errors');
import express, { Application, json } from 'express';
import cors from 'cors';

import { userRouter } from './routers/user/user';
import { errorHandler } from './util/errors/error-handler';

export const app: Application = express();

app.use(cors());
app.use(json());

app.use("/user", userRouter);

app.use(errorHandler);
