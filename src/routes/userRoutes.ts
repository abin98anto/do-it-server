import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

const userRouter = Router();
const authRouter = Router();

authRouter.post("/signup", userController.signup);
authRouter.post("/login", userController.login);
authRouter.post("/logout", userController.logout);
authRouter.post("/refresh-token", userController.refreshAccessToken);

userRouter.get("/profile", authenticate, (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
});

export default userRouter;
