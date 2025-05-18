import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.BASE_URL_FE as string,
        process.env.BASE_URL_BE as string,
      ],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["my-custom-header"],
    },
  });

  io.on("connection", (socket) => {
    console.log("new client connected.");
  });

  return io;
};
Server;
