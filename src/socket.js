import { io } from 'socket.io-client';
const URL = "https://task-manager-backend-u8y2.onrender.com"
// const URL = "http://localhost:4000"

export const socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
})