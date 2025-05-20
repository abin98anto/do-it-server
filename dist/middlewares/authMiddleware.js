"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errorUtils_1 = require("../utils/errorUtils");
const authenticate = async (req, _res, next) => {
    try {
        const accessToken = req.cookies["accessToken"];
        if (!accessToken) {
            throw new errorUtils_1.HttpError("Access token required", 401);
        }
        const decoded = (0, jwt_1.verifyAccessToken)(accessToken);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded._id)) {
            throw new errorUtils_1.HttpError("Invalid access token", 401);
        }
        req.user = {
            _id: decoded._id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
