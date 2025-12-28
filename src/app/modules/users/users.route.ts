import express from "express";
import { UserControllers } from "./users.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/all", auth(UserRole.admin), UserControllers.getAllUsers);

router.get("/me", auth(UserRole.admin, UserRole.user), UserControllers.getMe);
router.patch(
  "/update-profile",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  UserControllers.updateProfile
);

export const UserRoutes = router;
