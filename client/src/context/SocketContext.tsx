import React, { createContext, useEffect } from "react";
import SocketIoCient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { peerReducer } from "../reduces/PeerReducer";
import { addPeerAction } from "../actions/PeerAction";
import { useState } from "react";

const WS_SERVER = "http://localhost:3000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoCient(WS_SERVER, {
  withCredentials: false,
  transports: ["polling", "websocket"],
});

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // peers will store peerId and their corresponding MediaStream
  const [peers, dispatch] = React.useReducer(peerReducer, {});

  const fetchParticipants = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log(`Room ${roomId} has participants:`, participants);
  };

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  useEffect(() => {
    const userId = uuidv4();
    const newPeer = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
      secure: false, // for local dev
    });

    setUser(newPeer);

    // Fetch user media stream
    fetchUserFeed();

    // Listen for room creation and navigate
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom);

    socket.on("get-users", fetchParticipants);

    // Cleanup on unmount
    return () => {
      newPeer.destroy(); // destroys Peer connection
    };
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      if (peerId === user.id) return;
      const call = user.call(peerId, stream);
      call.on("stream", (remoteStream) => {
        dispatch(addPeerAction(peerId, remoteStream));
      });
    };

    socket.on("user-joined", handleUserJoined);

    user.on("call", (call) => {
      if (call.peer === user.id) return;
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        dispatch(addPeerAction(call.peer, remoteStream));
      });
    });

    socket.emit("ready");

    return () => {
      socket.off("user-joined", handleUserJoined);
    };
  }, [user, stream]);

  return (
    <SocketContext.Provider value={{ socket, user, stream, peers }}>
      {children}
    </SocketContext.Provider>
  );
};
