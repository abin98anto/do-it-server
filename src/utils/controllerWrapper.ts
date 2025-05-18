import { asyncHandler } from "../middlewares/asyncHandler";
import { AsyncHandler } from "../types/misc/AsyncHandler";

export const wrapControllers = (controllers: Record<string, AsyncHandler>) => {
  return Object.fromEntries(
    Object.entries(controllers).map(([key, fn]) => [key, asyncHandler(fn)])
  );
};
