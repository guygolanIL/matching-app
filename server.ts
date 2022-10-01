import { app } from "./app";
import { prismaClient } from "./data/prisma-client";
import { redisClient } from "./data/redis";

const port = process.env.PORT || 3000;

async function start() {
    await prismaClient.$connect();
    console.log('connected to db');
    await redisClient.connect();
    console.log('redis connected');
    app.listen(port, () => {
        console.log('app started on port ' + port)
    });
}

start();