import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import ITask from "../types/ITask";
import TaskModel from "../models/TaskModel";
import { TaskStatus } from "../constants/TaskStatus";

export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, dueDate } = req.body;
    const userId = req.user!._id;

    const task = await TaskModel.create({
      userId,
      title,
      description,
      dueDate,
      status: TaskStatus.PENDING,
    });

    const io = req.app.get("io");
    io.to(userId.toString()).emit("taskCreated", task);

    res.status(201).json({ success: true, data: task });
  }
);

export const getTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const tasks = await TaskModel.find({ userId });
    res.status(200).json({ success: true, data: tasks });
  }
);

export const getTaskById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const task = await TaskModel.findOne({ _id: req.params.id, userId });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json({ success: true, data: task });
  }
);

export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const io = req.app.get("io");
    io.to(userId.toString()).emit("taskUpdated", task);

    res.status(200).json({ success: true, data: task });
  }
);

export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const task = await TaskModel.findOneAndDelete({
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
  }
);

export const getTaskStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const currentDate = new Date();

    const tasks = await TaskModel.find({ userId });

    const totalTasks: number = tasks.length;
    const completedTasks: number = tasks.filter(
      (task) => (task as unknown as ITask).status === "completed"
    ).length;
    const pendingTasks: number = tasks.filter(
      (task) => (task as unknown as ITask).status === "pending"
    ).length;
    const overdueTasks: number = tasks.filter(
      (task) =>
        (task as unknown as ITask).status === "pending" &&
        new Date((task as unknown as ITask).dueDate) < currentDate
    ).length;

    const stats = {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    };

    res.status(200).json({ success: true, data: stats });
  }
);
