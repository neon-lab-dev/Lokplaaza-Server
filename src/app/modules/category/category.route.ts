import express from "express";
import { multerUpload } from "../../config/multer.config";
import { UserRole } from "../auth/auth.constannts";
import auth from "../../middlewares/auth";
import { CategoryControllers } from "./category.controller";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CategoryControllers.addCategory
);

router.get("/", CategoryControllers.getAllCategories);

router.get("/:categoryId", CategoryControllers.getSingleCategory);

router.put(
  "/update/:categoryId",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CategoryControllers.updateCategory
);

router.delete(
  "/delete/:categoryId",
  auth(UserRole.admin, UserRole.moderator),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;