import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket, user } = useContext(SocketContext);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    // reset after 10 seconds
    setTimeout(() => setCopied(false), 10000);
  };

  // Emit joined-room when component mounts
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!socket || !roomId || !user) return;
    if (!joined) {
      socket.emit("joined-room", { roomId: roomId, peerId: user?.id });
      setJoined(true); // mark as joined so we don't emit again
    }
  }, [socket, roomId, joined, user?.id]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
        Welcome to Your Room
      </h1>

      {/* Room ID */}
      <div className="bg-white shadow-md rounded-lg px-6 py-4 mb-4 w-full max-w-md text-center">
        <p className="text-lg md:text-xl text-gray-700">
          <span className="font-semibold">Room ID:</span> {roomId}
        </p>
      </div>

      {/* Share instruction */}
      <p className="text-gray-600 text-center mb-6">
        Share this link with others to join the room
      </p>

      {/* Copy link button */}
      <button
        onClick={handleCopy}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
          ${
            copied
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
        `}
      >
        {copied ? "Copied!" : "Copy Room Link"}
      </button>
    </div>
  );
};

export default Room;
