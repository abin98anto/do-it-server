import mongoose from "mongoose";
import { TaskStatus } from "../constants/TaskStatus";

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("Task", TaskSchema);
export default TaskModel;
