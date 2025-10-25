import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { logger, serverConfig } from "./config";

const app = express();
const port = serverConfig.PORT;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  logger.info(`New User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

server.on("error", (err) => {
  logger.error("Server error:", err);
  process.exit(1);
});
