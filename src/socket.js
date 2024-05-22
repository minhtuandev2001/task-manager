import { io } from 'socket.io-client';
const URL = "https://task-manager-backend-ten-iota.vercel.app"

export const socket = io(URL, {
  autoConnect: false,
})