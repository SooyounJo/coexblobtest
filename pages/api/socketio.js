import { Server } from 'socket.io';

export default function socketHandler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/socket.io',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('socket.io connected:', socket.id);
      socket.emit('welcome', 'Welcome to Socket.IO server!');

      socket.on('ping', (payload) => {
        io.emit('pong', payload);
      });

      socket.on('disconnect', () => {
        console.log('socket.io disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
