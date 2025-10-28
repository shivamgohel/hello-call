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

    rooms[roomId] = []; // create a new entry for the room

    socket.emit("room-created", { roomId });
    logger.info(`Socket ${socket.id} created room: ${roomId}`);
  };

  // this event is fired when a peer joins a room
  const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      logger.info(`Peer ${peerId} is joining room: ${roomId}`);
      rooms[roomId].push(peerId);

      logger.info(`Current participants in room ${roomId}: ${rooms[roomId]}`);
      socket.join(roomId);

      socket.on("ready", () => {
        socket.to(roomId).emit("user-joined", { peerId });
      });

      socket.emit("get-users", {
        participants: rooms[roomId].filter((id) => id !== peerId),
        roomId,
      });
    }
  };

  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
};

export default roomHandler;
