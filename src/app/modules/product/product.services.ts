/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import Product from "./product.model";
import { TProduct } from "./product.interface";
import { v2 as cloudinary } from "cloudinary";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import AppError from "../../errors/AppError";
import { uploadToS3 } from "../../utils/uploadToS3";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Add product (admin only)
const addProduct = async (
  payload: TProduct,
  imageFiles?: Express.Multer.File[],
  glbFile?: Express.Multer.File
) => {
  let imageUrls: string[] = [];
  let arFileUrl: string | undefined;

  try {
    // Upload images to Cloudinary
    if (imageFiles && imageFiles.length > 0) {
      const uploadedImages = await Promise.all(
        imageFiles.map((file) => sendImageToCloudinary(file.originalname, file.path))
      );
      imageUrls = uploadedImages.map((img) => img.secure_url);
    }

    // Upload GLB file to S3
    if (glbFile) {
      console.log("Uploading GLB file to S3:", glbFile.originalname);
      
      // Optional: Validate file type
      if (!glbFile.mimetype.includes('gltf') && !glbFile.originalname.endsWith('.glb')) {
        throw new Error('Invalid file type. Only GLB files are allowed.');
      }
      
      // Upload to S3
      const uploadedGlb = await uploadToS3(glbFile, 'products/glb');
      arFileUrl = uploadedGlb.url;
      console.log("GLB file uploaded to S3:", arFileUrl);
    }

    // Generate custom productId like LOK-1234
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const productId = `LOK-${randomNumber}`;

    const payloadData = {
      ...payload,
      productId,
      imageUrls,
      arFileUrl,
    };

    const result = await Product.create(payloadData);
    return result;
    
  } catch (error) {
    // Cleanup: If product creation fails, delete uploaded files
    if (arFileUrl) {
      // You might want to implement cleanup logic here
      console.error('Product creation failed, but files were uploaded:', error);
    }
    throw error;
  }
};


// Get all products
const getAllProducts = async (
  keyword?: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  // Search filter
  if (keyword) {
    query.$or = [
      { productId: { $regex: keyword, $options: "i" } },
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // Category filter
  if (category && category !== "all") {
    query.category = { $regex: category, $options: "i" };
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query["sizes.discountedPrice"] = {};
    if (minPrice !== undefined) query["sizes.discountedPrice"].$gte = minPrice;
    if (maxPrice !== undefined) query["sizes.discountedPrice"].$lte = maxPrice;
  }

  // Pagination
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: products,
  };
};


// Get single product by ID
const getSingleProductById = async (id: string) => {
  const result = await Product.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  return result;
};

// Update product
const updateProduct = async (
  id: string,
  payload: Partial<TProduct>,
  files?: Express.Multer.File[]
) => {
  const existing = await Product.findById(id);

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  let imageUrls: string[] | undefined;

  if (files && files.length > 0) {
    const uploadedImages = await Promise.all(
      files.map((file) => sendImageToCloudinary(file.originalname, file.path))
    );
    imageUrls = uploadedImages.map((img) => img.secure_url);
  }

  const updatePayload: Partial<TProduct> = {
    ...payload,
    ...(imageUrls && { imageUrls }),
  };

  const result = await Product.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete product by ID
const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Delete all product images from Cloudinary
  if (product.imageUrls && product.imageUrls.length > 0) {
    for (const url of product.imageUrls) {
      try {
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        const publicId = decodeURIComponent(filename.split(".")[0]);

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting Cloudinary image:", err);
      }
    }
  }

  // Delete product from DB
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  addProduct,
  getAllProducts,
  getSingleProductById,
  updateProduct,
  deleteProduct,
};
