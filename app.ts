import { config } from 'dotenv';
config();
import express, { Application, json } from 'express';
import { prismaClient } from './data';
import { loginRouter } from './routers/login';
import { isAuthenticated } from './auth/config/passport';
import { protectedRouter } from './routers/protectedRouter';
import { setupAuth } from './auth';

const port = process.env.PORT || 3000;
const app: Application = express();

setupAuth(app);

app.use(json());

app.use("/protected", isAuthenticated, protectedRouter);
app.use("/login", loginRouter);

app.listen(port, () => {
    prismaClient.$connect()
        .then(() => console.log('app started on port ' + port))
        .catch(console.error);
});
