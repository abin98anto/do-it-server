"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const corsOptions_1 = require("./config/corsOptions");
const mongo_1 = require("./services/mongo");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const http_1 = require("http");
const SocketService_1 = require("./services/SocketService");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const taskRouter_1 = __importDefault(require("./routes/taskRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
const server = (0, http_1.createServer)(app);
const io = (0, SocketService_1.initializeSocket)(server);
app.set("io", io);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
app.get("/", (_req, res) => {
    res.send("Server is runningggg!");
});
app.use("/api", userRoutes_1.default);
app.use("/api/task", taskRouter_1.default);
app.use(errorMiddleware_1.errorHandler);
(0, mongo_1.connectDB)().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
