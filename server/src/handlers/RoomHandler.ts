import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config";

const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidv4();
    socket.join(roomId);

    logger.info(`Socket ${socket.id} created room: ${roomId}`);

    socket.emit("room-created", { roomId });
  };

  const joinedRoom = (data: { roomId: string }) => {
    const { roomId } = data; // extract actual string
    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room: ${roomId}`);
  };

  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
};

export default roomHandler;
