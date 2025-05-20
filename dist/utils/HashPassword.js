"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    try {
        const salt = 10;
        const sPassword = await bcrypt_1.default.hash(password, salt);
        return sPassword;
    }
    catch (error) {
        console.log("Error Hashing Password.", error);
    }
};
exports.default = hashPassword;
