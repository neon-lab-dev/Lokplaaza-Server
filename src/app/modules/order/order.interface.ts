import { ObjectId } from "mongoose";

export interface TProductOrderItem {
  productId: ObjectId;
  name: string;
  quantity: number;
  color: string;
  size: string;
  price: number;
}

export interface TOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  orderedItems: TProductOrderItem[];
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  razorpayOrderId?: string;
}
