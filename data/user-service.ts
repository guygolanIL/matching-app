import { User } from "@prisma/client";
import { db } from "."

export const userService = {
    async findByEmail(email: string): Promise<User | null> {
        const user: User | null = await db.user.findFirst({
            where: {
                email,
            }
        });

        return user;
    }
}