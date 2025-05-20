"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_ACCESS;
const ACCESS_EXPIRY = "1d";
const REFRESH_SECRET = process.env.JWT_REFRESH;
const REFRESH_EXPIRY = "7d";
const generateAccessToken = (data) => {
    return jsonwebtoken_1.default.sign(data, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (data) => {
    return jsonwebtoken_1.default.sign(data, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
    }
    catch (error) {
        console.error("Invalid access token", error);
        throw new Error("Invalid access token");
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
    }
    catch (error) {
        console.error("Invalid refresh token", error);
        throw new Error("Invalid refresh token");
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
