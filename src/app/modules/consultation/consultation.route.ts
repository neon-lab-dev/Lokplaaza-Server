import express from "express";
import { ConsultationControllers } from "./consultation.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";

const router = express.Router();

router.post(
  "/book",
  ConsultationControllers.bookConsultation
);

router.get("/", auth(UserRole.admin, UserRole.moderator), ConsultationControllers.getAllConsultations);
router.get("/:id", auth(UserRole.admin, UserRole.moderator), ConsultationControllers.getSingleConsultation);

router.delete(
  "/delete/:id",
  auth(UserRole.admin, UserRole.moderator),
  ConsultationControllers.deleteConsultation
);

export const ConsultationRoutes = router;
