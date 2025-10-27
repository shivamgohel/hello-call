import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config";

import IRoomParams from "../interfaces/IRoomParams";

// Shared rooms object for all sockets
// will store roomId, and array of peerIds
const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {
  // this event is fired when a peer creates a room
  const createRoom = () => {
    const roomId = uuidv4();
    socket.join(roomId);

    logger.info(`Socket ${socket.id} created room: ${roomId}`);

    socket.emit("room-created", { roomId });
  };

  // this event is fired when a peer joins a room
  const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(peerId);
    socket.join(roomId);

    logger.info(
      `Socket ${socket.id} joined room: ${roomId} with peer: ${peerId}`,
    );

    socket.emit("room-users", {
      participants: rooms[roomId],
      roomId,
    });
  };

  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
};

export default roomHandler;
