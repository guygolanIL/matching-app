import { Match } from '@prisma/client';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
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
    matchCreated: (match: Match) => void;
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
        console.log('new user connected');

        socket.on('identify', (identification) => {
            SocketContext.identify(socket.id, identification);
            console.log('user identified as', identification);
        });

        socket.on('disconnect', (reason) => {
            SocketContext.disconnect(socket.id);
            console.log('user disconnected')
        });
    });

    return socketServer;
}