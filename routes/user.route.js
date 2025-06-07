import express from "express";
import { login, register, updateProfile,logout, googleLogin } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(upload,register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated,upload,updateProfile);
router.route("/logout").get(logout);
router.route("/google").post(googleLogin);
export default router;