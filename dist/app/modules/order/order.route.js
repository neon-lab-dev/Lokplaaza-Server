"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constannts_1 = require("../auth/auth.constannts");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post("/checkout", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator, auth_constannts_1.UserRole.user), order_controller_1.OrderControllers.checkout);
router.post("/verify-payment", order_controller_1.OrderControllers.verifyPayment);
router.post("/create", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator, auth_constannts_1.UserRole.user), order_controller_1.OrderControllers.createOrder);
router.get("/my-orders", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator, auth_constannts_1.UserRole.user), order_controller_1.OrderControllers.getMyOrders);
// For admin/moderator only
router.get("/", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), order_controller_1.OrderControllers.getAllOrders);
router.put("/update-status", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), order_controller_1.OrderControllers.updateDeliveryStatus);
router.get("/user/:userCustomId", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), order_controller_1.OrderControllers.getOrdersByUserId);
router.get("/:orderId", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), order_controller_1.OrderControllers.getSingleOrderById);
exports.OrderRoutes = router;
