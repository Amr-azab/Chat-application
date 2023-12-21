import multer from "multer";
import sharp from "sharp";
const cloudinary = require("cloudinary").v2;
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { RequestHandler, Request, Response } from "express";
import { CustomRequest } from "../interfaces/customRequest";
import User, { IUser } from "../model/User";
import {
  DecodedToken,
  LoginBody,
  SignupBody,
} from "../interfaces/userController";
import Room from "../model/Room";

import { sign, verify as verifyJWT } from "jsonwebtoken";

const signToken = (id: string) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response
): void => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
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
const multerStorage = multer.memoryStorage();
const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images.", 404), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
export const uploadUserPhoto = upload.single("photo");
export const resizeUserPhoto: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`src/data/${req.file.filename}`);

    next();
  }
);
export const filterObj = (obj: any, ...allowedFields: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

interface UpdateBody {
  password: string;
}
export const updateMe: RequestHandler = catchAsync(
  async (req: CustomRequest<UpdateBody>, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "userName", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const signup: RequestHandler = catchAsync(
  async (req: CustomRequest<SignupBody>, res, next) => {
    const newUser: IUser = await User.create({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    createSendToken(newUser, 201, req, res);
  }
);
const jwtVerifyPromisified = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    verifyJWT(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

export const login: RequestHandler = catchAsync(
  async (req: CustomRequest<LoginBody>, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email or password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("incorrect email or password", 404));
    }

    createSendToken(user, 200, req, res);
  }
);

export const protect: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    // 1) check if token is there and if it exists
    let token: string | undefined = req.cookies.jwt;

    if (!token) {
      return next(new AppError("please login to access this route", 401));
    }

    // 2) Verify Token

    const decoded = (await jwtVerifyPromisified(
      token,
      process.env.JWT_SECRET
    )) as DecodedToken;

    // 3) check if user exist
    const currentUser = (await User.findById(decoded.id)) as IUser;
    if (!currentUser) {
      return next(new AppError("please login to access this route", 404));
    }
    req.user = currentUser;

    next();
  }
);

export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response, next) => {
    res.cookie("jwt", "", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      message: "logged out successfully",
    });
  }
);

export const getMe: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    const user = await User.findById(req.user?.id);

    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);
export const getAllUsers: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    const users = await User.find({ _id: { $ne: req.user?.id } }).select(
      "-password -__v"
    );

    res.status(200).json({
      status: "success",
      data: users,
    });
  }
);
