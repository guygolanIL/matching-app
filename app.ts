import { config } from 'dotenv';
config();
require('express-async-errors');
import express, { Application, json } from 'express';
import { prismaClient } from './data/prisma-client';
import { userRouter } from './routers/user/user';
import { setupAuth } from './auth';
import cors from 'cors';
import { errorHandler } from './util/errors/error-handler';

const port = process.env.PORT || 3000;
const app: Application = express();

setupAuth(app);
app.use(cors());
app.use(json());

app.use("/user", userRouter);

app.use(errorHandler);

app.listen(port, () => {
    prismaClient.$connect()
        .then(() => console.log('app started on port ' + port))
        .catch(console.error);
});

