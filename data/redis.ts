import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

export const TokenCache = {
    saveToken(userId: number, userRefreshToken: string) {
        return redisClient.set(`refresh_token_${userId}`, userRefreshToken);
    },
    revokeToken(userId: number) {
        return redisClient.del(`refresh_token_${userId}`);
    },
    getToken(userId: number) {
        return redisClient.get(`refresh_token_${userId}`);
    }
}