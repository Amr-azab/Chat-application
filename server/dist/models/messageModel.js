"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.Schema({
    friend: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: [true, "can't be blank"],
    },
}, { timestamps: true });
const Msg = mongoose_2.default.model("Message", messageSchema);
exports.default = Msg;
