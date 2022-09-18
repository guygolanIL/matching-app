import { Attitude, User, UserClassification } from "@prisma/client";
import { prismaClient } from "../index";

export async function findByEmail(email: string): Promise<User | null> {
    const user: User | null = await prismaClient.user.findFirst({
        where: {
            email,
        }
    });

    return user;
}

type ClassifyUserOptions = {
    userId: number;
    targetUserId: number;
    attitude: Attitude;
};
export async function classifyUser({ attitude, targetUserId, userId }: ClassifyUserOptions): Promise<UserClassification> {
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
};

export async function create(email: string, password: string): Promise<User> {
    const user = await prismaClient.user.create({
        data: {
            email,
            password
        }
    });

    return user;
}

type Location = {
    longitude: number;
    latitude: number;
}

export async function updateLocation(email: string, location: Location): Promise<void> {
    const { latitude, longitude } = location;
    await prismaClient.user.update({
        where: {
            email
        },
        data: {
            latitude,
            longitude
        }
    });
}


type FindUsersByDistanceOptions = {
    userEmail: string;
    location: Location;
    distanceLimit: number;
};
export async function findUsersByDistance({
    userEmail,
    location,
    distanceLimit
}: FindUsersByDistanceOptions): Promise<{ id: number; email: string; distance: number; }[]> {
    return await prismaClient.$queryRaw`
        SELECT 
            id,
            email,
            calculate_distance(${location.latitude}, ${location.longitude}, u.latitude, u.longitude, 'K') AS distance
        FROM public."User" u
        WHERE 
            calculate_distance(${location.latitude}, ${location.longitude}, u.latitude, u.longitude, 'K') <= ${distanceLimit} 
            AND
            email != '${userEmail}';
    `;
}