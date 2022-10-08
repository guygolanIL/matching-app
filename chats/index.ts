import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

type ClientToServerEvents = {
    message: (a: any) => void;
};

type ServerToClientEvents = {
    pong: () => void;
};

interface InterServerEvents {
    ping: () => void;
}

type SocketData = {

};

export function createChatServer(server?: Server) {
    const socketServer = new SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

    socketServer.on('connection', socket => {
        console.log('connection');
        socket.on('message', (a: any) => {
            console.log('message from client', a);
            socket.emit('pong');
        });
    });

    return socketServer;
}

