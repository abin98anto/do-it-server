import { Request, Response, NextFunction } from "express";
import { AsyncHandler } from "../types/misc/AsyncHandler";

export const asyncHandler =
  (fn: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
