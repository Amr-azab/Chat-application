"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const msgController_1 = require("../controller/msgController");
const router = express_1.default.Router();
// Define the route to send a message to a friend
router.post("/:authorId/:friendId/send-message", msgController_1.sendMsgToFriend);
router.get("/:id", msgController_1.getConvById);
router.get("/:id/getLastMsg", msgController_1.getMessageById);
exports.default = router;
