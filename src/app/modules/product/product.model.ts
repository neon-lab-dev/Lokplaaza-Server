import { Schema, model } from "mongoose";
import { TProduct } from "./product.interface";

const ProductSchema = new Schema<TProduct>(
  {
    productId: { type: String, required: true, unique: true },
    imageUrls: { type: [String], required: true },
    arFileUrl: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    colors: [
      {
        colorName: { type: String, required: true },
        sizes: [
          {
            size: { type: String, required: true },
            quantity: { type: Number, required: true },
            basePrice: { type: Number, required: true },
            discountedPrice: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Product = model<TProduct>("Product", ProductSchema);
export default Product;