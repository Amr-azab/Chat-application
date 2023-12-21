"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        unique: true,
        validate: [validator_1.default.isEmail],
        required: [true, "Email is required"],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        select: false,
        minlength: 8,
        require: [true, "Provide a password"],
    },
    messages: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
