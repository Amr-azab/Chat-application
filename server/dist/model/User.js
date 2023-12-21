"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "user must have name!"],
    },
    userName: {
        type: String,
        unique: true,
        required: [true, "user must have username!"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "user must have email!"],
        validate: [validator_1.default.isEmail, "Please provide a valid email!"],
    },
    password: {
        type: String,
        required: [true, "user must have password!"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "passwords are not the same",
        },
    },
    photo: {
        type: String,
        default: "https://res.cloudinary.com/df6gs6m1e/image/upload/v1694554226/wallpaperflare.com_wallpaper_3_tjpvzd.jpg",
    },
});
userSchema.pre("save", async function (next) {
    this.password = await bcrypt_1.default.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});
userSchema.methods.correctPassword = async (enteredPass, storedPass) => {
    return await bcrypt_1.default.compare(enteredPass, storedPass);
};
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
