import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.replace('/api', '');
    
    socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: false,
      withCredentials: true
    });
  }
  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinTrip = (tripId) => {
  if (socket && socket.connected) {
    socket.emit('join-trip', tripId);
  }
};

export const getSocket = () => socket;
