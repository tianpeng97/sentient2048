import { io } from 'socket.io-client'

// TODO
const URL =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'

export const socket = io(undefined, {
  autoConnect: false,
})
