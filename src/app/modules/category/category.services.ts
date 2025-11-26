/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Category from "./category.model";
import { TCategory } from "./category.interface";

// Create Category
const addCategory = async (payload: TCategory) => {
  const isExist = await Category.findOne({ name: payload.name });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");
  }
  return await Category.create(payload);
};

// Get All Categories with search + pagination
const getAllCategories = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [{ name: { $regex: keyword, $options: "i" } }];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Category.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Single Category
const getSingleCategory = async (id: string) => {
  const result = await Category.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return result;
};

// Update Category
const updateCategory = async (id: string, payload: Partial<TCategory>) => {
  const isExist = await Category.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete Category
const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return result;
};

export const CategoryServices = {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
