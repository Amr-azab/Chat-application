"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
    });
};
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
// SIGNUP FUNCTION
exports.signup = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newUser = await userModel_1.default.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
    });
    createSendToken(newUser, 201, req, res);
});
// LOGIN FUNCTION
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    // 1. Check If email Or Pass is exist
    if (!email || !password) {
        return next(new appError_1.AppError("Please provide email and password!", 400));
    }
    // 2. Check If User Exist & password is correct
    const user = await userModel_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.AppError("Incorrect email or password", 401));
    }
    // 3. Send Token if every thing is okay
    createSendToken(user, 200, req, res);
});
