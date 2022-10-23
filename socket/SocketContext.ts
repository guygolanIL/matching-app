import { Server as SocketServer } from 'socket.io';

import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, SocketIdentification } from "./socket-server";

export type ISocketContext = {
    io: SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | undefined;
    info: Record<string, SocketInfo>;

    connect(socketId: string): void;
    identify(socketId: string, identification: SocketIdentification): void;
    disconnect(socketId: string): void;

    _getSocketId(userId: number): string | undefined;
    emitIfConnected<TEvent extends keyof ServerToClientEvents>(userId: number, event: TEvent, ...eventPayload: Parameters<ServerToClientEvents[TEvent]>): void;
};
type SocketInfo = {
    userId?: number;
}
export const SocketContext: ISocketContext = {
    io: undefined,
    info: {},

    connect(socketId) {
        this.info[socketId] = {};
    },
    identify(socketId, identification) {
        const existingSocketInfo = Object.entries(this.info).find(([socketId, socketInfo]) => socketInfo.userId === identification.userId);

        if (existingSocketInfo) {
            const [existingSocketId, _] = existingSocketInfo;
            delete this.info[existingSocketId];
        }

        this.info[socketId] = {
            ...identification
        };
    },
    disconnect(socketId) {
        delete this.info[socketId];
    },

    _getSocketId(userId) {
        const result = Object.entries(this.info).find(([socketId, socketInfo]) => socketInfo.userId === userId);

        if (!result) return;

        const [socketId] = result;
        return socketId;
    },

    emitIfConnected<TEvent extends keyof ServerToClientEvents>(userId: number, event: TEvent, ...eventPayload: Parameters<ServerToClientEvents[TEvent]>) {
        const recipientSocketId = this._getSocketId(userId);
        if (recipientSocketId) { // user is online
            this.io?.to(recipientSocketId).emit(event, ...eventPayload);
        } else {
            console.log('user is not online');
        }
    },
} 