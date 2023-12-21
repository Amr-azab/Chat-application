"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const conversationSchema = new mongoose_2.Schema({
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    messages: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Message",
            required: true,
        },
    ],
}, { timestamps: true });
const Conversation = mongoose_1.default.model("Conversation", conversationSchema);
exports.default = Conversation;
