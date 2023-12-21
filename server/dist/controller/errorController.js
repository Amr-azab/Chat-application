"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/appError");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new appError_1.AppError(message, 400);
};
const handleJWTError = () => new appError_1.AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new appError_1.AppError("Your token has expired! Please log in again.", 401);
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        console.error("ERROR 💥", err);
        res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message,
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        else {
            console.error("ERROR 💥", err);
            res.status(500).json({
                status: "error",
                message: "Something went very wrong!",
            });
        }
    }
    else {
        if (err.isOperational) {
            res.status(err.statusCode).render("error", {
                title: "Something went wrong!",
                msg: err.message,
            });
        }
        else {
            console.error("ERROR 💥", err);
            res.status(err.statusCode).render("error", {
                title: "Something went wrong!",
                msg: "Please try again later.",
            });
        }
    }
};
const errorHandler = (err, req, res, next) => {
    const error = err;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let handledError = { ...error };
        handledError.message = error.message;
        if (handledError.name === "CastError")
            handledError = handleCastErrorDB(handledError);
        if (handledError.statusCode === 11000)
            handledError = handleDuplicateFieldsDB(handledError);
        if (handledError.name === "ValidationError")
            handledError = handleValidationErrorDB(handledError);
        if (handledError.name === "JsonWebTokenError")
            handledError = handleJWTError();
        if (handledError.name === "TokenExpiredError")
            handledError = handleJWTExpiredError();
        sendErrorProd(handledError, req, res);
    }
};
exports.default = errorHandler;
