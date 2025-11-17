import { Schema, model } from "mongoose";
import { TProduct } from "./product.interface";

const ProductSchema = new Schema<TProduct>(
  {
    productId: { type: String, required: true, unique: true },
    imageUrls: { type: [String], required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    clothDetails: { type: String },
    productStory: { type: String },
    category: { type: String, required: true },
    madeIn: { type: String },
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
