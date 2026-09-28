import { io } from 'socket.io-client';
import { API_URL } from './axios';

export const socket = io(API_URL, { autoConnect: false });

export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => socket.disconnect();