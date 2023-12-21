"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const roomController_1 = require("../controllers/roomController");
exports.router = express_1.default.Router();
exports.router.route("/roomCheck/:id").get(userController_1.protect, roomController_1.roomCheck);
exports.router.route("/getChats").get(userController_1.protect, roomController_1.getChats);
