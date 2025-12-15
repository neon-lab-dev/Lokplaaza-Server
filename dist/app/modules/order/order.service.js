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
    const razorpayOrder = yield razorpay_1.razorpay.orders.create({
        amount: amount * 100, //in paisa
        currency: "INR",
    });
    return razorpayOrder;
});
// Verify payment
const verifyPayment = (razorpayPaymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return `${process.env.PAYMENT_REDIRECT_URL}?orderId=${razorpayPaymentId}`;
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
        userId: user === null || user === void 0 ? void 0 : user.userId,
        orderedItems,
        totalAmount: payload.totalAmount,
        status: "pending",
    };
    const order = yield order_model_1.Order.create(payloadData);
    return order;
});
// Get all orders
const getAllOrders = (keyword_1, status_1, ...args_1) => __awaiter(void 0, [keyword_1, status_1, ...args_1], void 0, function* (keyword, status, page = 1, limit = 10) {
    var _a;
    const skip = (page - 1) * limit;
    const matchStage = {};
    // Status filter
    if (status && status !== "all") {
        matchStage.status = status;
    }
    // Keyword search
    if (keyword) {
        matchStage.$or = [
            { orderId: { $regex: keyword, $options: "i" } },
            { "user.name": { $regex: keyword, $options: "i" } },
            { "user.email": { $regex: keyword, $options: "i" } },
            { "user.phoneNumber": { $regex: keyword, $options: "i" } },
        ];
    }
    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "products",
                localField: "orderedItems.productId",
                foreignField: "_id",
                as: "products",
            },
        },
        {
            $addFields: {
                orderedItems: {
                    $map: {
                        input: "$orderedItems",
                        as: "item",
                        in: {
                            $mergeObjects: [
                                "$$item",
                                {
                                    product: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$products",
                                                    as: "p",
                                                    cond: { $eq: ["$$p._id", "$$item.productId"] },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                orderId: 1,
                status: 1,
                totalAmount: 1,
                createdAt: 1,
                orderedItems: {
                    name: 1,
                    quantity: 1,
                    size: 1,
                    color: 1,
                    price: 1,
                    productId: 1,
                    product: {
                        category: 1,
                        name: 1,
                    },
                },
                user: {
                    name: 1,
                    email: 1,
                    phoneNumber: 1,
                    city: 1,
                    pinCode: 1,
                    addressLine1: 1,
                    addressLine2: 1,
                },
            },
        },
    ];
    const countPipeline = [
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        { $match: matchStage },
        { $count: "total" },
    ];
    const [orders, countResult] = yield Promise.all([
        order_model_1.Order.aggregate(pipeline),
        order_model_1.Order.aggregate(countPipeline),
    ]);
    const total = ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
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
const geOrdersByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({ userId });
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
            .populate("orderedItems.productId", "name productId"),
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
    const result = yield order_model_1.Order.findOneAndUpdate({ _id: payload.orderId }, { status: payload.status }, { new: true });
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
