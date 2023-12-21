"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
exports.router = express_1.default.Router();
exports.router.route("/signup").post(userController_1.signup);
exports.router.route("/login").post(userController_1.login);
exports.router.route("/getMe").get(userController_1.protect, userController_1.getMe);
exports.router.route("/getAllUsers").get(userController_1.protect, userController_1.getAllUsers);
exports.router.route("/logout").post(userController_1.protect, userController_1.logout);
exports.router.route("/:id/update").patch(userController_1.uploadUserPhoto, userController_1.resizeUserPhoto, userController_1.updateMe);
