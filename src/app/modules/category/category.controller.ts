import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryServices } from "./category.services";

// Add Category
const addCategory = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const result = await CategoryServices.addCategory(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category added successfully",
    data: result,
  });
});

// Get All Categories
const getAllCategories = catchAsync(async (req, res) => {
  const { page = "1", limit = "10", keyword } = req.query;

  const result = await CategoryServices.getAllCategories(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: {
      categories: result.data,
      pagination: result.meta,
    },
  });
});

// Get Single Category
const getSingleCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await CategoryServices.getSingleCategory(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

// Update Category
const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const file = req.file;
  const result = await CategoryServices.updateCategory(
    categoryId,
    req.body,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

// Delete Category
const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await CategoryServices.deleteCategory(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
