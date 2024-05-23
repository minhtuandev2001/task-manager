import { io } from 'socket.io-client';
const URL = "https://localhost:4000"
// const URL = "https://task-manager-backend-ten-iota.vercel.app"

export const socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
})