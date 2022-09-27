import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

export const TokenCache = {
    saveRefreshToken(userId: number, userRefreshToken: string) {
        return redisClient.set(`refresh_token_${userId}`, userRefreshToken);
    },
    revoke(userId: number) {
        return redisClient.del(`refresh_token_${userId}`);
    }
}