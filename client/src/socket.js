// frontend/src/socket.js
import { io } from 'socket.io-client';

const socket = io('https://live-polling-backend-2ier.onrender.com', {
  transports: ['websocket'],
});

export default socket;
