import express from "express";
import { CustomizationControllers } from "./customization.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";

const router = express.Router();

// Create customization request
router.post(
  "/submit",
  CustomizationControllers.postCustomizationRequest
);

// Get all customization requests (admin/moderator)
router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  CustomizationControllers.getAllCustomizationRequests
);

// Get single customization request by ID
router.get(
  "/:id",
  auth(UserRole.admin, UserRole.moderator),
  CustomizationControllers.getSingleRequestById
);

export const CustomizationRoutes = router;