import { Match } from "@prisma/client";

import { prismaClient } from "../data/prisma-client";

export async function findMatches(userId: number) {
    return prismaClient.match.findMany({
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
}

export async function findMatch(matchId: number) {
    return prismaClient.match.findUnique({
        where: {
            id: matchId
        },
        include: {
            creatingUser: true,
            initiatingUser: true
        }
    });
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

export async function findMatchMessages(matchId: number) {
    const messages = await prismaClient.message.findMany({
        where: {
            matchId
        }
    });

    return messages;
}

export async function createMessage(matchId: number, content: string, createdByUserId: number) {
    return await prismaClient.message.create({
        data: {
            matchId,
            content,
            createdByUserId,
        }
    });
}