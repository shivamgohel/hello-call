import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket, user, stream, peers } = useContext(SocketContext);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    // reset after 10 seconds
    setTimeout(() => setCopied(false), 10000);
  };

  useEffect(() => {
    // emitting this event so that either creator of room or joinee in the room
    // anyone is added the server knows that new people have been added\
    // to this room
    if (user) {
      console.log("New user with id", user.id, "has joined room", roomId);
      socket.emit("joined-room", { roomId: roomId, peerId: user.id });
    }
  }, [roomId, user, socket]);

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

      {/* Your Own Feed */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center">
          Your Feed
        </h2>

        {stream ? (
          <UserFeedPlayer stream={stream} isMuted={true} label="You" />
        ) : (
          <div className="flex justify-center items-center h-48 bg-gray-200 rounded-md">
            <p className="text-gray-500">🎥 Waiting for camera permission...</p>
          </div>
        )}
      </div>

      {/* Other Users Feed */}
      <div className="mt-8 w-full">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center">
          Other Participants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.keys(peers).filter((id) => id !== user?.id).length > 0 ? (
            Object.keys(peers)
              .filter((id) => id !== user?.id)
              .map((peerId) => (
                <UserFeedPlayer
                  key={peerId}
                  stream={peers[peerId]?.stream || null}
                  isMuted={false}
                  label={peerId}
                />
              ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No other participants yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
