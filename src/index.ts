import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { corsOptions } from "./config/corsOptions";
import { connectDB } from "./services/mongo";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.send("Server is runningggg!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
