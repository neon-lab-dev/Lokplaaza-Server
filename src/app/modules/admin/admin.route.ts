import express from "express";
import { AdminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";

const router = express.Router();

router.get(
  "/stats",
  auth(UserRole.admin, UserRole.moderator),
  AdminControllers.getAdminStats
);

export const AdminRoutes = router;
