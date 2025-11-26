/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Product from "../product/product.model";
import { razorpay } from "./../../utils/razorpay";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";

const generateOrderId = () => {
  return "ORD-" + Math.floor(1000 + Math.random() * 9000);
};

const checkout = async (amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100, //in paisa
    currency: "INR",
  });

  return razorpayOrder;
};

// Verify payment
const verifyPayment = async (razorpayPaymentId: string) => {
  return `${process.env.PAYMENT_REDIRECT_URL}-success?type=product&orderId=${razorpayPaymentId}`;
};

// Create Razorpay order
const createOrder = async (user: any, payload: TOrder) => {
  const productIds = payload.orderedItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== payload.orderedItems.length) {
    throw new Error("Some products not found");
  }

  for (const item of payload.orderedItems) {
    const product = products.find(
      (p) => p._id.toString() === item.productId.toString()
    );

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    //Check color availability
    const colorObj = product.colors.find(
      (c: any) => c.colorName === item.color
    );
    if (!colorObj) {
      throw new Error(
        `Color ${item.color} is not available for product ${product.name}`
      );
    }

    //Check size availability under the color
    const sizeObj = colorObj.sizes.find((s: any) => s.size === item.size);
    if (!sizeObj) {
      throw new Error(
        `Size ${item.size} is not available for color ${item.color} of product ${product.name}`
      );
    }

    //Check quantity availability
    if (sizeObj.quantity < item.quantity) {
      throw new Error(
        `Not enough stock for size ${item.size} of color ${item.color} in product ${product.name}. Available: ${sizeObj.quantity}`
      );
    }

    //Reduce stock
    sizeObj.quantity -= item.quantity;
    if (sizeObj.quantity < 0) sizeObj.quantity = 0;

    //Save updated product
    await product.save();
  }

  // Generate Order ID
  const orderId = generateOrderId();

  const orderedItems = payload?.orderedItems;

  const payloadData = {
    orderId,
    userId: user?._id,
    userCustomId: user?.userId,
    orderedItems,
    totalAmount: payload.totalAmount,
    status: "pending",
  };

  const order = await Order.create(payloadData);

  return order;
};

// Get all orders
const getAllOrders = async (
  keyword?: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  // Status filter
  if (status && status !== "all") {
    query.status = { $regex: status, $options: "i" };
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Base query
  let mongooseQuery = Order.find(query)
    .populate(
      "userId",
      "name email phoneNumber pinCode city addressLine1 addressLine2"
    )
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

  const [orders, total] = await Promise.all([
    mongooseQuery.sort({ createdAt: -1 }),
    Order.countDocuments(query),
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
};

// Get single order by ID
const getSingleOrderById = async (orderId: string) => {
  const result = await Order.findOne({ orderId })
    .populate(
      "userId",
      "name email phoneNumber pinCode city addressLine1 addressLine2"
    )
    .populate("orderedItems.productId", "name imageUrls category");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return result;
};

// Get all orders for a particular user
const geOrdersByUserId = async (userCustomId: string) => {
  const result = await Order.find({ userCustomId });
  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }
  return result;
};

// Get my orders
const getMyOrders = async (
  userId: string,
  keyword?: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const query: any = { userId };

  if (keyword) {
    query.$or = [{ orderId: { $regex: keyword, $options: "i" } }];
  }

  if (status && status !== "all") {
    query.status = { $regex: status, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(
        "userId",
        "name phoneNumber city pinCode addressLine1 addressLine2"
      )
      .populate("orderedItems.productId", "name"),
    Order.countDocuments(query),
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
};

// Get my orders (user)
const updateDeliveryStatus = async (payload: {
  orderId: string;
  status: string;
}) => {
  const result = await Order.findOneAndUpdate(
    { orderId: payload.orderId },
    { status: payload.status },
    { new: true }
  );
  return result;
};

export const OrderService = {
  checkout,
  verifyPayment,
  createOrder,
  getAllOrders,
  getSingleOrderById,
  geOrdersByUserId,
  getMyOrders,
  updateDeliveryStatus,
};
