"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", userController_1.signup);
userRouter.post("/login", userController_1.login);
userRouter.post("/logout", userController_1.logout);
userRouter.post("/refresh-token", userController_1.refreshAccessToken);
userRouter.get("/profile", authMiddleware_1.authenticate, (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});
exports.default = userRouter;
