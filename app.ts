import { config } from 'dotenv';
config();
require('express-async-errors');
import express, { Application, json } from 'express';
import cors from 'cors';

import { prismaClient } from './data/prisma-client';
import { userRouter } from './routers/user/user';
import { errorHandler } from './util/errors/error-handler';
import { redisClient } from './data/redis';

const port = process.env.PORT || 3000;
const app: Application = express();

app.use(cors());
app.use(json());

app.use("/user", userRouter);

app.use(errorHandler);

app.listen(port, () => {
    prismaClient
        .$connect()
        .then(() => console.log('app started on port ' + port))
        .then(() => redisClient.connect())
        .then(() => console.log('redis connected'))
        .catch(console.error);
});

