"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TaskStatus_1 = require("../constants/TaskStatus");
const TaskSchema = new mongoose_1.default.Schema({
    userId: { type: String, ref: "User", required: true },
    title: String,
    description: String,
    dueDate: Date,
    status: {
        type: String,
        enum: Object.values(TaskStatus_1.TaskStatus),
        default: TaskStatus_1.TaskStatus.PENDING,
    },
}, {
    timestamps: true,
});
const TaskModel = mongoose_1.default.model("Task", TaskSchema);
exports.default = TaskModel;
