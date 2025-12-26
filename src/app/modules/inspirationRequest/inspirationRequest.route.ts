import express from "express";
import { InspirationRequestControllers } from "./inspirationRequest.controller";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";

const router = express.Router();

router.post(
  "/upload",
  multerUpload.single("file"),
  InspirationRequestControllers.uploadInspirationImage
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  InspirationRequestControllers.getAllInspirationRequests
);

router.delete(
  "/delete/:id",
  auth(UserRole.admin, UserRole.moderator),
  InspirationRequestControllers.deleteInspirationRequest
);

export const InspirationRequestRoutes = router;