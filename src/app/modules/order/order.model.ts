import { Schema, model } from "mongoose";
import { TOrder, TProductOrderItem } from "./order.interface";

const OrderItemSchema = new Schema<TProductOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
});

const ProductOrderSchema = new Schema<TOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    orderedItems: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
  },
  { timestamps: true }
);

export const Order = model<TOrder>("Order", ProductOrderSchema);