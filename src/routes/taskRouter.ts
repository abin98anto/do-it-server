import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authMiddleware";

const taskRouter: Router = Router();

// taskRouter.use(authenticate);
taskRouter.route("/").post(createTask).get(getTasks);
taskRouter.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);
taskRouter.route("/stats").get(getTaskStats);

export default taskRouter;