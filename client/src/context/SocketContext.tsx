import React, { createContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

const WS_SERVER = "http://localhost:3000";

// Create socket once globally
const socket: Socket = io(WS_SERVER, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

// Define context interface
interface ISocketContext {
  socket: Socket;
  user: Peer | null;
}

// Create context with default values
export const SocketContext = createContext<ISocketContext>({
  socket,
  user: null,
});

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<Peer | null>(null);

  const fetchParticipants = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log(`Room ${roomId} has participants:`, participants);
  };

  useEffect(() => {
    const userId = uuidv4();
    const newPeer = new Peer(userId);
    setUser(newPeer);

    // Listen for room creation and navigate
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom);

    socket.on("room-users", fetchParticipants);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, user }}>
      {children}
    </SocketContext.Provider>
  );
};
