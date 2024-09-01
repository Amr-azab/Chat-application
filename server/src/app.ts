import express, { Request, Response, NextFunction } from "express";
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
app.use("/api/chat-application/room", roomRouter);
app.use(express.static(`${__dirname}/build`));
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(`${__dirname}/build/index.html`);
});
app.use(errorHandler);

export default app;
