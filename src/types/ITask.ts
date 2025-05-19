import { TaskStatus } from "../constants/TaskStatus";

export default interface ITask {
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
