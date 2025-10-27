import React, { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

const CreateRoom: React.FC = () => {
  const { socket } = useContext(SocketContext);

  const initRoom = () => {
    if (!socket) return;
    socket.emit("create-room");
  };

  // Listen for server response
  useEffect(() => {
    if (!socket) return;

    socket.on("room-created", (data) => {
      console.log("Room created:", data);
    });

    return () => {
      socket.off("room-created");
    };
  }, [socket]);

  return (
    <button
      onClick={initRoom}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
    >
      Create New Room
    </button>
  );
};

export default CreateRoom;
