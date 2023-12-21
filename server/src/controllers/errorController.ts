import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later.",
      });
    }
  }
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as AppError;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
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

export default errorHandler;
