"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageById = exports.getConvById = exports.getConversation = exports.sendMsgToFriend = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const userModel_1 = __importDefault(require("../models/userModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const appError_1 = require("../utils/appError");
exports.sendMsgToFriend = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    try {
        const authorId = req.params.authorId;
        const friendId = req.params.friendId;
        const { message } = req.body;
        const author = await userModel_1.default.findById(authorId);
        const friend = await userModel_1.default.findById(friendId);
        if (!author || !friend)
            return next(new appError_1.AppError("Author or Friend not found", 404));
        const newMessage = new messageModel_1.default({
            author: authorId,
            friend: friendId,
            message: message,
        });
        await newMessage.save();
        // Find or create the conversation between the author and friend
        let conversation = await conversationModel_1.default.findOne({
            participants: { $all: [authorId, friendId] },
        });
        if (!conversation) {
            conversation = new conversationModel_1.default({
                participants: [authorId, friendId],
                messages: [newMessage],
            });
        }
        else {
            conversation.messages.push(newMessage._id);
        }
        await conversation.save();
        // Add the message to the author's and friend's message history
        author.messages.push(newMessage._id);
        friend.messages.push(newMessage._id);
        await author.save();
        await friend.save();
        return res.status(200).json({
            message: newMessage,
        });
    }
    catch (err) {
        return next(new appError_1.AppError("Internal server error", 500));
    }
});
// Function to get a conversation between author and friend
exports.getConversation = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    try {
        const { authorId, friendId } = req.params;
        const conversation = await conversationModel_1.default.findOne({
            participants: { $all: [authorId, friendId] },
        });
        if (!conversation) {
            return next(new appError_1.AppError("Conversation not found", 404));
        }
        const messages = await messageModel_1.default.find({
            _id: { $in: conversation.messages },
        });
        return res.status(200).json({
            conversation: {
                participants: conversation.participants,
                messages,
            },
        });
    }
    catch (err) {
        return next(new appError_1.AppError("Internal server error", 500));
    }
});
exports.getConvById = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const conv = await conversationModel_1.default.findById(id);
    const message = conv === null || conv === void 0 ? void 0 : conv.messages.slice(-1);
    console.log(message);
    if (!message) {
        throw new Error(`No Conversation with ID ${id} found`);
    }
    return res.status(200).json({
        message,
    });
});
exports.getMessageById = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const message = await messageModel_1.default.findById(id);
    if (!message) {
        throw new Error(`No message with ID ${id} found`);
    }
    return res.status(200).json({
        message,
    });
});
