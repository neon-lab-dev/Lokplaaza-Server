import express from "express";
import { CategoryControllers } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  CategoryControllers.addCategory
);

router.get("/", CategoryControllers.getAllCategories);

router.delete(
  "/delete/:categoryId",
  auth(UserRole.admin, UserRole.moderator),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
