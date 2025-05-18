import jwt from "jsonwebtoken";
import JwtData from "../types/misc/JwtData";

const ACCESS_SECRET = process.env.JWT_ACCESS!;
const ACCESS_EXPIRY = "1d";
const REFRESH_SECRET = process.env.JWT_REFRESH!;
const REFRESH_EXPIRY = "7d";

export const generateAccessToken = (data: JwtData): string => {
  return jwt.sign(data, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};

export const generateRefreshToken = (data: JwtData): string => {
  return jwt.sign(data, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
};

export const verifyAccessToken = (token: string): JwtData | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtData;
  } catch (error) {
    console.error("Invalid access token", error);
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): JwtData => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtData;
  } catch (error) {
    console.error("Invalid refresh token", error);
    throw new Error("Invalid refresh token");
  }
};
