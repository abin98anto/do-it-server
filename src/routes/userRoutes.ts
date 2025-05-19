import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/refresh-token", refreshAccessToken);

userRouter.get("/profile", authenticate, (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
});

export default userRouter;
