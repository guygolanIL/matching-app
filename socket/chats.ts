import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

type ClientToServerEvents = {
    identify: (identification: { userId: number }) => void;
};

type ServerToClientEvents = {
    messagesUpdated: () => void;
};

interface InterServerEvents {
}

type SocketData = {

};

export function createChatServer(server?: Server) {
    const socketServer = new SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);
    SocketContext.io = socketServer;

    socketServer.on('connection', (socket) => {
        SocketContext.connect(socket.id);

        socket.on('identify', (identification) => {
            SocketContext.identify(socket.id, identification);
        });

        socket.on('disconnect', (reason) => {
            SocketContext.disconnect(socket.id);
        });
    });

    return socketServer;
}



export type SocketContextType = {
    io: SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | undefined;
    info: Record<string, SocketInfo>;

    connect(socketId: string): void;
    identify(socketId: string, identification: SocketIdentification): void;
    disconnect(socketId: string): void;

    getSocketId(userId: number): string | undefined;
    emitIfConnected(userId: number, event: keyof ServerToClientEvents): void;
};
type SocketIdentification = {
    userId: number;
}
type SocketInfo = {
    userId?: number;
}
export const SocketContext: SocketContextType = {
    io: undefined,
    info: {},

    connect(socketId) {
        this.info[socketId] = {};
    },
    identify(socketId, identification) {
        this.info[socketId] = {
            ...identification
        };
    },
    disconnect(socketId) {
        delete this.info[socketId];
    },

    getSocketId(userId) {
        const result = Object.entries(this.info).find(([socketId, socketInfo]) => socketInfo.userId === userId);

        if (!result) return;

        const [socketId] = result;
        return socketId;
    },

    emitIfConnected(userId, event: keyof ServerToClientEvents) {
        const recipientSocketId = this.getSocketId(userId);
        if (recipientSocketId) { // user is online
            this.io?.to(recipientSocketId).emit(event);
        }
    },
} 