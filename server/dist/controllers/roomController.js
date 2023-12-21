"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = exports.roomCheck = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const Room_1 = __importDefault(require("../model/Room"));
exports.roomCheck = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a, _b, _c;
    let room;
    let statusCode = 200;
    room = await Room_1.default.findOne({
        users: { $size: 2, $all: [(_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.params.id] },
    }).populate({
        path: "users",
    });
    if (!room) {
        room = await Room_1.default.create({
            users: [(_b = req.user) === null || _b === void 0 ? void 0 : _b.id, (_c = req.params) === null || _c === void 0 ? void 0 : _c.id],
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
});
exports.getChats = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const rooms = await Room_1.default.find().select({
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
});
