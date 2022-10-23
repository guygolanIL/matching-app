import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

import { MatchInfo } from '../routers/match/controllers/getMatches';
import { SocketContext } from './SocketContext';

// copy this to the client
export type SocketIdentification = {
    userId: number;
}

// copy this to the client
export type ClientToServerEvents = {
    identify: (identification: SocketIdentification) => void;
};

// copy this interface to the client
export type ServerToClientEvents = {
    messagesUpdated: () => void;
    matchCreated: (match: MatchInfo) => void;
};

export interface InterServerEvents {
}

export type SocketData = {

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