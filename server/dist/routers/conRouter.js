"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const msgController_1 = require("../controller/msgController");
const router = express_1.default.Router();
// Define the route to get a conversation
router.get("/conversations/:authorId/:friendId", msgController_1.getConversation);
exports.default = router;
