import { Request } from "express";
import { IUser } from "../model/User";

export interface CustomRequest<T = Request["body"]> extends Request {
  body: T;
  user?: IUser;
}
