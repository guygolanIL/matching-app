import { Attitude, User, UserClassification } from "@prisma/client";
import { prismaClient } from "../index";

type ClassifyUserOptions = {
    userId: number;
    targetUserId: number;
    attitude: Attitude;
};

export const userService = {
    async findByEmail(email: string): Promise<User | null> {
        const user: User | null = await prismaClient.user.findFirst({
            where: {
                email,
            }
        });

        return user;
    },

    async create(email: string, password: string): Promise<User> {
        const user = await prismaClient.user.create({
            data: {
                email,
                password
            }
        });

        return user;
    },

    async updateLocation(email: string, location: { longtitude: number, latitude: number }): Promise<void> {
        const { latitude, longtitude } = location;
        await prismaClient.user.update({
            where: {
                email
            },
            data: {
                latitude,
                longtitude
            }
        });
    },

    async classifyUser({ attitude, targetUserId, userId }: ClassifyUserOptions): Promise<UserClassification> {
        return await prismaClient.userClassification.upsert({
            create: {
                attitude,
                classifierUserId: userId,
                classifiedUserId: targetUserId,
            },
            update: {
                attitude,
            },
            where: {
                classifierUserId_classifiedUserId: {
                    classifierUserId: userId,
                    classifiedUserId: targetUserId
                }
            },
        });
    }
}