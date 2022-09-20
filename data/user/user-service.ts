import { Attitude, prisma, User, UserClassification } from "@prisma/client";
import { SessionUser } from "../../auth";
import { prismaClient } from "../prisma-client";

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
    user: SessionUser;
    distanceLimit: number;
    unit?: 'K' | 'M';
};
type FindUsersByDistanceResult = Array<{
    id: number;
    email: string;
    distance: number;
}>;
export async function findUsersProximateToUser({
    user,
    distanceLimit,
    unit = 'K'
}: FindUsersByDistanceOptions): Promise<FindUsersByDistanceResult> {
    console.log(`find proximate users for user ${user.id} with location (${user.latitude}, ${user.longitude}) with max distance of ${distanceLimit}`);
    return await prismaClient.$queryRaw<FindUsersByDistanceResult>`     
        SELECT 
            u.id,
            u.email,
            CALCULATE_DISTANCE(${user.latitude}, ${user.longitude}, u.LATITUDE, u.LONGITUDE, ${unit}) AS distance
        FROM PUBLIC."User" u
        WHERE u.id not in
                (SELECT uc."classifiedUserId"
                    FROM PUBLIC."UserClassification" uc
                    WHERE uc."classifierUserId" = ${user.id})
            AND u.id != ${user.id}
            AND CALCULATE_DISTANCE(${user.latitude}, ${user.longitude}, u.LATITUDE, u.LONGITUDE, ${unit}) <= ${distanceLimit}
    `;
}