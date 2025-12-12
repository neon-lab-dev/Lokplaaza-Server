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

    customizationFields: [
      {
        key: { type: String, required: true }, // e.g. "customSize"
        label: { type: String, required: true }, // e.g. "Custom Size"
        type: {
          type: String,
          enum: ["text", "textarea", "number", "select", "checkbox"],
          required: true,
        },
        required: { type: Boolean, default: false },
        options: [{ type: String }], // only for dropdown/select
        placeholder: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Product = model<TProduct>("Product", ProductSchema);
export default Product;