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
exports.OrderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = __importDefault(require("../product/product.model"));
const razorpay_1 = require("./../../utils/razorpay");
const order_model_1 = require("./order.model");
const generateOrderId = () => {
    return "ORD-" + Math.floor(1000 + Math.random() * 9000);
};
const checkout = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (!amount || amount <= 0) {
        throw new Error("Invalid payment amount");
    }
    const razorpayOrder = yield razorpay_1.razorpay.orders.create({
        amount: amount * 100, //in paisa
        currency: "INR",
    });
    return razorpayOrder;
});
// Verify payment
const verifyPayment = (razorpayPaymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return `${process.env.PAYMENT_REDIRECT_URL}-success?type=product&orderId=${razorpayPaymentId}`;
});
// Create Razorpay order
const createOrder = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const productIds = payload.orderedItems.map((i) => i.productId);
    const products = yield product_model_1.default.find({ _id: { $in: productIds } });
    if (products.length !== payload.orderedItems.length) {
        throw new Error("Some products not found");
    }
    for (const item of payload.orderedItems) {
        const product = products.find((p) => p._id.toString() === item.productId.toString());
        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }
        //Check color availability
        const colorObj = product.colors.find((c) => c.colorName === item.color);
        if (!colorObj) {
            throw new Error(`Color ${item.color} is not available for product ${product.name}`);
        }
        //Check size availability under the color
        const sizeObj = colorObj.sizes.find((s) => s.size === item.size);
        if (!sizeObj) {
            throw new Error(`Size ${item.size} is not available for color ${item.color} of product ${product.name}`);
        }
        //Check quantity availability
        if (sizeObj.quantity < item.quantity) {
            throw new Error(`Not enough stock for size ${item.size} of color ${item.color} in product ${product.name}. Available: ${sizeObj.quantity}`);
        }
        //Reduce stock
        sizeObj.quantity -= item.quantity;
        if (sizeObj.quantity < 0)
            sizeObj.quantity = 0;
        //Save updated product
        yield product.save();
    }
    // Generate Order ID
    const orderId = generateOrderId();
    const orderedItems = payload === null || payload === void 0 ? void 0 : payload.orderedItems;
    const payloadData = {
        orderId,
        userId: user === null || user === void 0 ? void 0 : user._id,
        userCustomId: user === null || user === void 0 ? void 0 : user.userId,
        orderedItems,
        totalAmount: payload.totalAmount,
        status: "pending",
    };
    const order = yield order_model_1.Order.create(payloadData);
    return order;
});
// Get all orders
const getAllOrders = (keyword_1, status_1, ...args_1) => __awaiter(void 0, [keyword_1, status_1, ...args_1], void 0, function* (keyword, status, page = 1, limit = 10) {
    const query = {};
    // Status filter
    if (status && status !== "all") {
        query.status = { $regex: status, $options: "i" };
    }
    // Pagination
    const skip = (page - 1) * limit;
    // Base query
    let mongooseQuery = order_model_1.Order.find(query)
        .populate("userId", "name email phoneNumber pinCode city addressLine1 addressLine2")
        .skip(skip)
        .limit(limit);
    // Apply keyword search (orderId + user fields)
    if (keyword) {
        mongooseQuery = mongooseQuery.find({
            $or: [
                { orderId: { $regex: keyword, $options: "i" } },
                { "userId.name": { $regex: keyword, $options: "i" } },
                { "userId.email": { $regex: keyword, $options: "i" } },
                { "userId.phoneNumber": { $regex: keyword, $options: "i" } },
            ],
        });
    }
    const [orders, total] = yield Promise.all([
        mongooseQuery.sort({ createdAt: -1 }),
        order_model_1.Order.countDocuments(query),
    ]);
    return {
        meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
        data: orders,
    };
});
// Get single order by ID
const getSingleOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findOne({ orderId })
        .populate("userId", "name email phoneNumber pinCode city addressLine1 addressLine2")
        .populate("orderedItems.productId", "name imageUrls category");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return result;
});
// Get all orders for a particular user
const geOrdersByUserId = (userCustomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({ userCustomId });
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No orders found for this user");
    }
    return result;
});
// Get my orders
const getMyOrders = (userId_1, keyword_1, status_1, ...args_1) => __awaiter(void 0, [userId_1, keyword_1, status_1, ...args_1], void 0, function* (userId, keyword, status, page = 1, limit = 10) {
    const query = { userId };
    if (keyword) {
        query.$or = [{ orderId: { $regex: keyword, $options: "i" } }];
    }
    if (status && status !== "all") {
        query.status = { $regex: status, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [orders, total] = yield Promise.all([
        order_model_1.Order.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("userId", "name phoneNumber city pinCode addressLine1 addressLine2")
            .populate("orderedItems.productId", "name"),
        order_model_1.Order.countDocuments(query),
    ]);
    return {
        meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
        data: orders,
    };
});
// Get my orders (user)
const updateDeliveryStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findOneAndUpdate({ orderId: payload.orderId }, { status: payload.status }, { new: true });
    return result;
});
exports.OrderService = {
    checkout,
    verifyPayment,
    createOrder,
    getAllOrders,
    getSingleOrderById,
    geOrdersByUserId,
    getMyOrders,
    updateDeliveryStatus,
};
