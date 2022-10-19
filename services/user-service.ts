import { Attitude, ImageType, User, UserClassification, UserProfile, ProfileImage, Match, OnboardingStatus } from "@prisma/client";

import { prismaClient } from "../data/prisma-client";
import * as matchService from './match-service';

export async function findByEmail(email: string): Promise<User | null> {
    const user: User | null = await prismaClient.user.findFirst({
        where: {
            email,
        }
    });

    return user;
}

export async function findPrivateUserProfile(userId: number): Promise<(UserProfile & {
    profileImage: ProfileImage | null;
}) | null> {
    const profile = await prismaClient.userProfile.findUnique({
        where: {
            userId
        },
        include: {
            profileImage: true,
            user: {
                select: {
                    email: true,
                }
            }
        }
    });

    return profile;
}

export async function updatePrivateUserProfile(userId: number, profileParams: { name?: string, onboardingStatus?: OnboardingStatus }) {
    return prismaClient.userProfile.update({
        where: {
            userId,
        },
        include: {
            profileImage: true
        },
        data: {
            ...profileParams,
        }
    });
}

export async function findPublicUserProfile(userId: number): Promise<(UserProfile & {
    profileImage: ProfileImage | null;
}) | null> {
    const profile = await prismaClient.userProfile.findUnique({
        where: {
            userId
        },
        include: {
            profileImage: true,
        }
    });

    return profile;
}

type ClassifyUserOptions = {
    userId: number;
    targetUserId: number;
    attitude: Attitude;
};
export async function classifyUser({
    attitude,
    targetUserId,
    userId }: ClassifyUserOptions
): Promise<{
    classification: UserClassification,
    match?: Match;
}> {
    const classification = await prismaClient.userClassification.upsert({
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

    if (classification.attitude === 'POSITIVE') {
        const oppositeClassification = await prismaClient.userClassification.findFirst({
            where: {
                classifierUserId: targetUserId,
                classifiedUserId: userId
            }
        });

        if (oppositeClassification?.attitude === 'POSITIVE') {
            // its a match!
            const match = await matchService.createMatch(userId, targetUserId);

            return {
                classification,
                match,
            };
        }
    }

    return {
        classification
    };
};

export async function create(email: string, password?: string): Promise<User> {
    const user = await prismaClient.user.create({
        data: {
            email,
            password,
            userProfile: {
                create: {
                    onboardingStatus: 'INITIAL'
                }
            }
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

export async function updateProfileImage(userId: number, url: string, type: ImageType) {
    return await prismaClient.userProfile.update({
        where: { userId },
        data: {
            profileImage: {
                upsert: {
                    create: {
                        type,
                        url,
                    },
                    update: {
                        type,
                        url
                    }
                }
            }
        },
        include: {
            profileImage: true
        }
    });
}

type FindUsersByDistanceOptions = {
    user: { id: number; longitude: number; latitude: number };
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

export type PublicProfileInfo = Pick<
    UserProfile & {
        profileImage: Pick<ProfileImage, 'url'> | null
    },
    'userId' | 'profileImage' | 'name'
>;
type PublicProfileInfos = Array<PublicProfileInfo>;
export async function findUsersPublicInfo(ids: Array<number>): Promise<PublicProfileInfos> {
    const profiles = await prismaClient.userProfile.findMany({
        include: {
            profileImage: {
                select: {
                    url: true
                }
            }
        },
        where: {
            userId: { in: ids }
        }
    });

    const publicProfileInfos: PublicProfileInfos = profiles.map(({ userId, profileImage, name }) => ({
        userId,
        name,
        profileImage,
    }));

    return publicProfileInfos;
}