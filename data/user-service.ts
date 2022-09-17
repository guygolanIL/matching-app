import { User } from "@prisma/client";
import { prismaClient } from "."

export const userService = {
    async findByEmail(email: string): Promise<User | null> {
        const user: User | null = await prismaClient.user.findFirst({
            where: {
                email,
            }
        });

        return user;
    }
}