import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { corsOptions } from "./config/corsOptions";
import { connectDB } from "./services/mongo";
import { errorHandler } from "./middlewares/errorMiddleware";
import { createServer } from "http";
import { initializeSocket } from "./services/SocketService";
import userRouter from "./routes/userRoutes";

const app = express();
app.use(cors(corsOptions));
const server = createServer(app);
const io = initializeSocket(server);
app.set("io", io);
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.send("Server is runningggg!");
});

app.use(userRouter);

app.use(errorHandler);

// app.listen(PORT, () => {
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
// });
