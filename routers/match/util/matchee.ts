import { Match, User } from "@prisma/client";

type MatchWithUser<U extends User> = Match & {
    creatingUser: U;
    initiatingUser: U;
}
export function getMatchee<U extends User>(ofUserId: number, match: MatchWithUser<U>): U {
    const { creatingUser, initiatingUser } = match;
    return creatingUser.id === ofUserId ? initiatingUser : creatingUser;
}