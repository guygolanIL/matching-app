import { Match } from "@prisma/client";

import { prismaClient } from "../data/prisma-client";

export async function findMatches(userId: number) {
    const matches = await prismaClient.match.findMany({
        where: {
            OR: [
                {
                    initiatingUserId: userId,
                },
                {
                    creatingUserId: userId,
                }
            ]
        },
        include: {
            creatingUser: {
                include: {
                    userProfile: {
                        include: {
                            profileImage: true
                        }
                    }
                }
            },
            initiatingUser: {
                include: {
                    userProfile: {
                        include: {
                            profileImage: true
                        }
                    }
                }
            }
        },
    });

    return matches;
}

export async function createMatch(creatingUserId: number, initiatingUserId: number) {

    const match: Match = await prismaClient.match.create({
        data: {
            creatingUserId,
            initiatingUserId
        }
    });

    return match;
}