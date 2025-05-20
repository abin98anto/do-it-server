"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const HashPassword_1 = __importDefault(require("../utils/HashPassword"));
const jwt_1 = require("../utils/jwt");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const errorUtils_1 = require("../utils/errorUtils");
exports.signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userData = req.body;
    const userExists = await UserModel_1.default.findOne({ email: userData.email });
    if (userExists) {
        throw new errorUtils_1.HttpError("Email is taken.", 409);
    }
    const hashedPassword = await (0, HashPassword_1.default)(userData.password);
    const newUser = new UserModel_1.default(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
    await newUser.save();
    res.status(200).json({ success: true, data: newUser });
    return;
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userData = req.body;
    const user = await UserModel_1.default.findOne({ email: userData.email });
    const isPasswordValid = await bcrypt_1.default.compare(userData.password, (user === null || user === void 0 ? void 0 : user.password) || "");
    if (!user || !isPasswordValid) {
        throw new errorUtils_1.HttpError("Invalid credentials.", 401);
    }
    const accessToken = (0, jwt_1.generateAccessToken)({
        _id: user._id.toString(),
        email: user.email,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
        _id: user._id.toString(),
        email: user.email,
    });
    const _a = JSON.parse(JSON.stringify(user)), { password: _pass } = _a, otherData = __rest(_a, ["password"]);
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
exports.logout = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
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
exports.refreshAccessToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded._id)) {
        throw new errorUtils_1.HttpError("Invalid refresh token.", 401);
    }
    const user = await UserModel_1.default.findById(decoded._id);
    if (!user) {
        throw new errorUtils_1.HttpError("User not found", 404);
    }
    const accessToken = (0, jwt_1.generateAccessToken)({
        _id: user._id.toString(),
        email: user.email,
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
});
