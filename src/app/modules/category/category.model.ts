import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    imageUrl: { type: String, required: false , trim: true},
  },
  {
    timestamps: true,
  }
);

const Category = model<TCategory>("Category", CategorySchema);
export default Category;