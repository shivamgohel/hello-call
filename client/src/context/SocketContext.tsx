import React, { createContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const WS_SERVER = "http://localhost:3000";

// Create socket once globally
const socket: Socket = io(WS_SERVER, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

export const SocketContext = createContext<Socket | null>(socket);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom);
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
