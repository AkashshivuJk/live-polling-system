// frontend/src/socket.js
import { io } from 'socket.io-client';

const socket = io('https://live-poll-backend.onrender.com', {
  transports: ['websocket'],
});

export default socket;
