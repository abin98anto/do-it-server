import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "../utils/errorUtils";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      throw new HttpError("Access token required", 401);
    }

    const decoded = verifyAccessToken(accessToken);

    if (!decoded?._id) {
      throw new HttpError("Invalid access token", 401);
    }

    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
