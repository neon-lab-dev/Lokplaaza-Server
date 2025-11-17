import httpStatus from "http-status";
import { ProductServices } from "./product.services";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import AppError from "../../../errors/AppError";

// Add product (For admin)
const addProduct = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 4) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can upload maximum 4 images"
    );
  }
  const result = await ProductServices.addProduct(req.body, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product added successfully",
    data: result,
  });
});

// Get all products
const getAllProducts = catchAsync(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
  } = req.query;

  const result = await ProductServices.getAllProducts(
    keyword as string,
    category as string,
    minPrice ? Number(minPrice) : undefined,
    maxPrice ? Number(maxPrice) : undefined,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All products fetched successfully",
    data: {
      products: result.data,
      pagination: result.meta,
    },
  });
});

// Get single product by ID
const getSingleProductById = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProductById(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

// Update product
const updateProduct = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { productId } = req.params;
  const result = await ProductServices.updateProduct(
    productId,
    req.body,
    files
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// Delete product
const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.deleteProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductControllers = {
  addProduct,
  getAllProducts,
  getSingleProductById,
  updateProduct,
  deleteProduct,
};
