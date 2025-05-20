"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStats = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const TaskStatus_1 = require("../constants/TaskStatus");
exports.createTask = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { title, description, dueDate } = req.body;
    const userId = req.user._id;
    const task = await TaskModel_1.default.create({
        userId,
        title,
        description,
        dueDate,
        status: TaskStatus_1.TaskStatus.PENDING,
    });
    const io = req.app.get("io");
    io.to(userId.toString()).emit("taskCreated", task);
    res.status(201).json({ success: true, data: task });
});
exports.getTasks = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { userId } = req.params;
    const tasks = await TaskModel_1.default.find({ userId });
    res.status(200).json({ success: true, data: tasks });
});
exports.getTaskById = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user._id;
    const task = await TaskModel_1.default.findOne({ _id: req.params.id, userId });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }
    res.status(200).json({ success: true, data: task });
});
exports.updateTask = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user._id;
    const task = await TaskModel_1.default.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true, runValidators: true });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }
    const io = req.app.get("io");
    io.to(userId.toString()).emit("taskUpdated", task);
    res.status(200).json({ success: true, data: task });
});
exports.deleteTask = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user._id;
    const task = await TaskModel_1.default.findOneAndDelete({
        _id: req.params.id,
        userId,
    });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }
    const io = req.app.get("io");
    io.to(userId.toString()).emit("taskDeleted", { id: req.params.id });
    res.status(204).json({ success: true });
});
exports.getTaskStats = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user._id;
    const currentDate = new Date();
    const tasks = await TaskModel_1.default.find({ userId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const pendingTasks = tasks.filter((task) => task.status === "pending").length;
    const overdueTasks = tasks.filter((task) => task.status === "pending" &&
        new Date(task.dueDate) < currentDate).length;
    const stats = {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
    };
    res.status(200).json({ success: true, data: stats });
});
