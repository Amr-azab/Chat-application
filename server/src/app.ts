// import express from "express";
// import cors from "cors";
// import rateLimit from "express-rate-limit";

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
import express, { RequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import { router as userRouter } from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import errorHandler from "./controllers/errorController";
import { router as roomRouter } from "./routes/roomRoutes";

const app = express();

app.enable("trust proxy");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.options("*", cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/chat-application/user", userRouter);
// app.use('/api/chat-application/message', messageRouter);
app.use("/api/chat-application/room", roomRouter);

app.use(errorHandler);

export default app;
