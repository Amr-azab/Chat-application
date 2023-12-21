import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

import { RequestHandler, Request, Response } from "express";
import { CustomRequest } from "../interfaces/customRequest";
import Room from "../model/Room";

export const roomCheck: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    let room;
    let statusCode: number = 200;

    room = await Room.findOne({
      users: { $size: 2, $all: [req.user?.id, req.params.id] },
    }).populate({
      path: "users",
    });

    if (!room) {
      room = await Room.create({
        users: [req.user?.id, req.params?.id],
      });

      statusCode = 201;
    }
    room = await room.populate({
      path: "users",
    });

    res.status(statusCode).json({
      status: "success",
      room,
    });
  }
);

export const getChats: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    const rooms = await Room.find().select({
      messages: { $slice: -1 },
      users: 0,
      _id: 0,
      __v: 0,
    });

    const data = rooms.flatMap((el) => el.messages);

    res.status(200).json({
      status: "success",
      data,
    });
  }
);
