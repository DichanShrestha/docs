import { io } from "socket.io-client";

export const socket = io("http://localhost", {
  transports: ["websocket"],
});
