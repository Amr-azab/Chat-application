"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getMe = exports.logout = exports.protect = exports.login = exports.signup = exports.updateMe = exports.filterObj = exports.resizeUserPhoto = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary = require("cloudinary").v2;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = require("jsonwebtoken");
const signToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
// IMAGE UPLOADS
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new appError_1.AppError("Please upload only images.", 404), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    if (!req.file)
        return next();
    req.file.filename = `user-${Date.now()}.jpeg`;
    await (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/data/${req.file.filename}`);
    next();
});
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
exports.filterObj = filterObj;
exports.updateMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
        return next(new appError_1.AppError("This route is not for password updates. Please use /updateMyPassword.", 400));
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = (0, exports.filterObj)(req.body, "userName", "email");
    if (req.file)
        filteredBody.photo = req.file.filename;
    // 3) Update user document
    const { id } = req.params;
    const updatedUser = await User_1.default.findByIdAndUpdate(id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});
exports.signup = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newUser = await User_1.default.create({
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    createSendToken(newUser, 201, req, res);
});
const jwtVerifyPromisified = (token, secret) => {
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.verify)(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.AppError("Please provide email or password!", 400));
    }
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.AppError("incorrect email or password", 404));
    }
    createSendToken(user, 200, req, res);
});
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // 1) check if token is there and if it exists
    let token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("please login to access this route", 401));
    }
    // 2) Verify Token
    const decoded = (await jwtVerifyPromisified(token, process.env.JWT_SECRET));
    // 3) check if user exist
    const currentUser = (await User_1.default.findById(decoded.id));
    if (!currentUser) {
        return next(new appError_1.AppError("please login to access this route", 404));
    }
    req.user = currentUser;
    next();
});
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: "success",
        message: "logged out successfully",
    });
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    const user = await User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).json({
        status: "success",
        data: user,
    });
});
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    const users = await User_1.default.find({ _id: { $ne: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } }).select("-password -__v");
    res.status(200).json({
        status: "success",
        data: users,
    });
});
