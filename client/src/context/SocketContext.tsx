import React, { createContext } from "react";
import { io, Socket } from "socket.io-client";

const WS_SERVER = "http://localhost:3000";

// Create a socket instance
const socket: Socket = io(WS_SERVER, {
  transports: ["websocket"], // Ensures WebSocket connection
});

// Create context (socket or null)
export const SocketContext = createContext<Socket | null>(null);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
