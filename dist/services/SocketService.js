"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const initializeSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on("joinRoom", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their task room`);
        });
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
