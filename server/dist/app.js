"use strict";
// import express from "express";
// import cors from "cors";
// import rateLimit from "express-rate-limit";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import morgan from "morgan";
// import { json } from "body-parser";
// import cookieParser from "cookie-parser";
// import { router } from "./routers/userRouter";
// import msgRouter from "./routers/msgRouter";
// import conversationRouter from "./routers/conRouter";
// import globalErrorHandler from "./controller/errorController";
// const app = express();
// app.use(json());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.options("*", cors());
// // Limit requests from same API //app
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter); //app
// app.use(globalErrorHandler);
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }
// app.use(cookieParser());
// app.use("/api/v1/users", router);
// app.use("/api/v1/msgs", msgRouter);
// app.use("/api/v1", conversationRouter);
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = require("./routes/userRoutes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const roomRoutes_1 = require("./routes/roomRoutes");
const app = (0, express_1.default)();
app.enable("trust proxy");
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.options("*", (0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/chat-application/user", userRoutes_1.router);
// app.use('/api/chat-application/message', messageRouter);
app.use("/api/chat-application/room", roomRoutes_1.router);
app.use(errorController_1.default);
exports.default = app;
