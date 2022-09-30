import { app } from "./app";
import { prismaClient } from "./data/prisma-client";
import { redisClient } from "./data/redis";
import { uploadImage } from "./util/images/images";

const port = process.env.PORT || 3000;

async function start() {
    try {
        await prismaClient.$connect();
        console.log('connected to db');
        await redisClient.connect();
        console.log('redis connected');
        app.listen(port, () => {
            console.log('app started on port ' + port)
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// start();
uploadImage()