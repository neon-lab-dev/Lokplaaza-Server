import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";
import { OrderControllers } from "./order.controller";

const router = Router();

router.post("/checkout", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.checkout);
router.post("/verify-payment", OrderControllers.verifyPayment);
router.post("/create", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.createOrder);
router.get("/my-orders", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.getMyOrders);

// For admin/moderator only
router.get("/", auth(UserRole.admin, UserRole.moderator), OrderControllers.getAllOrders);
router.get("/:orderId", auth(UserRole.admin, UserRole.moderator), OrderControllers.getSingleOrderById);
router.get("/user/:userCustomId", auth(UserRole.admin, UserRole.moderator), OrderControllers.getOrdersByUserId);
router.put("/update-status", auth(UserRole.admin, UserRole.moderator), OrderControllers.updateDeliveryStatus);

export const OrderRoutes = router;