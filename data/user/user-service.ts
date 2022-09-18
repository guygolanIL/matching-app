import { User } from "@prisma/client";
import { prismaClient } from "../index";

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
    }
}