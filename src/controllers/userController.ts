import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import IUser from "../types/IUser";
import hashPassword from "../utils/HashPassword";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HttpError } from "../utils/errorUtils";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const userData: IUser = req.body;

  const userExists = await UserModel.findOne({ email: userData.email });
  if (userExists) {
    throw new HttpError("Email is taken.", 409);
  }

  const hashedPassword = await hashPassword(userData.password);
  const newUser = new UserModel({ ...userData, password: hashedPassword });
  await newUser.save();

  res.status(200).json({ success: true, data: newUser });
  return;
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const userData: Partial<IUser> = req.body;

  const user = await UserModel.findOne({ email: userData.email });
  const isPasswordValid = await bcrypt.compare(
    userData.password!,
    user?.password || ""
  );

  if (!user || !isPasswordValid) {
    throw new HttpError("Invalid credentials.", 401);
  }

  const accessToken = generateAccessToken({
    _id: user._id.toString(),
    email: user.email as string,
  });

  const refreshToken = generateRefreshToken({
    _id: user._id.toString(),
    email: user.email as string,
  });

  const { password: _pass, ...otherData } = JSON.parse(JSON.stringify(user));

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ success: true, data: otherData });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Logout successful" });
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies["refreshToken"];
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded?._id) {
      throw new HttpError("Invalid refresh token.", 401);
    }

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      email: user.email as string,
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 30 * 1000,
      })
      .status(200)
      .json({ success: true, message: "New access token created." });
  }
);
