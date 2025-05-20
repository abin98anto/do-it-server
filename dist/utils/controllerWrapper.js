"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapControllers = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const wrapControllers = (controllers) => {
    return Object.fromEntries(Object.entries(controllers).map(([key, fn]) => [key, (0, asyncHandler_1.asyncHandler)(fn)]));
};
exports.wrapControllers = wrapControllers;
