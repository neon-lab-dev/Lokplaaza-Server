import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "./auth.constannts";
const router = express.Router();

router.post("/signup", AuthControllers.signup);

router.post(
  "/login",
  validateRequest(AuthValidations.LoginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/refresh-token",
  auth(UserRole.admin, UserRole.user),
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post("/forgot-password", AuthControllers.forgetPassword);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

router.post(
  "/change-password",
  auth(UserRole.admin, UserRole.user),
  AuthControllers.changePassword
);


export const AuthRoute = router;
