import express from "express";
import {
  login,
  protect,
  signup,
  getMe,
  getAllUsers,
  logout,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
} from "../controllers/userController";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/getMe").get(protect, getMe);
router.route("/getAllUsers").get(protect, getAllUsers);
router.route("/logout").post(protect, logout);
router.route("/:id/update").patch(uploadUserPhoto, resizeUserPhoto, updateMe);
