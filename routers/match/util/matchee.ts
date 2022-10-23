import { Match, User } from "@prisma/client";

export function getMatcheeUserId(ofUserId: number, match: Match): number {
    const { creatingUserId, initiatingUserId } = match;
    return creatingUserId === ofUserId ? initiatingUserId : creatingUserId;
}

type MatchWithUser<U extends User> = Match & {
    creatingUser: U;
    initiatingUser: U;
}
export function getMatchee(ofUserId: number, match: MatchWithUser<User>): User {
    return match.creatingUserId === ofUserId ? match.initiatingUser : match.creatingUser;
}