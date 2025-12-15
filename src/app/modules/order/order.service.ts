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
  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100, //in paisa
    currency: "INR",
  });

  return razorpayOrder;
};

// Verify payment
const verifyPayment = async (razorpayPaymentId: string) => {
  return `${process.env.PAYMENT_REDIRECT_URL}?orderId=${razorpayPaymentId}`;
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
    userId: user?.userId,
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
  const skip = (page - 1) * limit;

  const matchStage: any = {};

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

  const pipeline: any = [
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

  const [orders, countResult] = await Promise.all([
    Order.aggregate(pipeline),
    Order.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;

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
const geOrdersByUserId = async (userId: string) => {
  const result = await Order.find({ userId });
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
      .populate("orderedItems.productId", "name productId"),
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
    { _id: payload.orderId },
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
