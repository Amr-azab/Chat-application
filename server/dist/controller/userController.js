"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.updateMe = exports.filterObj = exports.resizeUserPhoto = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary = require("cloudinary").v2;
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
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
    const filteredBody = (0, exports.filterObj)(req.body, "username", "email");
    if (req.file)
        filteredBody.photo = req.file.filename;
    // 3) Update user document
    const Id = req.params;
    const updatedUser = await userModel_1.default.findByIdAndUpdate(Id, filteredBody, {
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
exports.getAll = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const users = await userModel_1.default.find();
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            data: users,
        },
    });
});
/* export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
}; */
