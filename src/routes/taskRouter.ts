import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authMiddleware";

const taskRouter: Router = Router();

taskRouter.use(authenticate);
taskRouter.get("/:userId", getTasks);
taskRouter.post("/create", createTask);
taskRouter.get("/task/:id", getTaskById);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
