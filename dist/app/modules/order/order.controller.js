"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const checkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const razorpayOrder = yield order_service_1.OrderService.checkout(amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment initiated successfully",
        data: razorpayOrder,
    });
}));
// Verify payment
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_payment_id } = req.body;
    const redirectUrl = yield order_service_1.OrderService.verifyPayment(razorpay_payment_id);
    return res.redirect(redirectUrl);
}));
// Create order (customer)
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.createOrder(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order created successfully",
        data: result,
    });
}));
// Get all orders (Admin/Moderator)
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, page = "1", limit = "10" } = req.query;
    const result = yield order_service_1.OrderService.getAllOrders(keyword, status, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Orders fetched successfully",
        data: {
            orders: result.data,
            pagination: result.meta,
        },
    });
}));
// Get single order by ID
const getSingleOrderById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.OrderService.getSingleOrderById(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order fetched successfully",
        data: result,
    });
}));
// Get all orders for a particular user
const getOrdersByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield order_service_1.OrderService.geOrdersByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Orders fetched successfully",
        data: result,
    });
}));
// Get logged-in user's orders (user)
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { keyword, status, page = "1", limit = "10" } = req.query;
    const result = yield order_service_1.OrderService.getMyOrders(userId, keyword, status, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My orders fetched successfully",
        data: {
            orders: result.data,
            pagination: result.meta,
        },
    });
}));
// Update delivery status (Admin/Moderator)
const updateDeliveryStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.updateDeliveryStatus(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Status changed successfully",
        data: result,
    });
}));
exports.OrderControllers = {
    checkout,
    verifyPayment,
    createOrder,
    getAllOrders,
    getSingleOrderById,
    getOrdersByUserId,
    getMyOrders,
    updateDeliveryStatus,
};
