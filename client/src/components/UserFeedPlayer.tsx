import React, { useEffect, useRef } from "react";

interface UserFeedPlayerProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  label?: string;
}

const UserFeedPlayer: React.FC<UserFeedPlayerProps> = ({
  stream,
  isMuted = false,
  label = "User",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className="w-80 h-60 rounded-lg shadow-md border border-gray-300 bg-black"
      />
      <p className="text-gray-600 text-sm text-center">{label}</p>
    </div>
  );
};

export default UserFeedPlayer;
