import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { startStockSimulation } from './services/simulationService';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

startStockSimulation(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
