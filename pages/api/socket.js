import { Server } from 'ws';

const socketHandler = (req, res) => {
  if (res.socket.server.ws) {
    console.log('WebSocket server already running');
  } else {
    console.log('Starting WebSocket server');
    const wss = new Server({ server: res.socket.server });

    wss.on('connection', (ws) => {
      console.log('Client connected');
      ws.send('Welcome to the WebSocket server!');

      ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(message.toString());
          }
        });
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
    res.socket.server.ws = wss;
  }
  res.end();
};

export default socketHandler;
