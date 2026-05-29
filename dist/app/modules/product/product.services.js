"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = __importDefault(require("./product.model"));
const cloudinary_1 = require("cloudinary");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const AppError_1 = __importDefault(require("../../errors/AppError"));
// import { uploadToS3 } from "../../utils/uploadToS3";
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Add product (admin only)
const addProduct = (payload, imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrls = [];
    let arFileUrl;
    try {
        // Upload images to Cloudinary
        if (imageFiles && imageFiles.length > 0) {
            const uploadedImages = yield Promise.all(imageFiles.map((file) => (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path)));
            imageUrls = uploadedImages.map((img) => img.secure_url);
        }
        // Upload GLB file to S3
        // if (glbFile) {
        //   console.log("Uploading GLB file to S3:", glbFile.originalname);
        //   if (!glbFile.mimetype.includes('gltf') && !glbFile.originalname.endsWith('.glb')) {
        //     throw new Error('Invalid file type. Only GLB files are allowed.');
        //   }
        //   const uploadedGlb = await uploadToS3(glbFile, 'products/glb');
        //   arFileUrl = uploadedGlb.url;
        //   console.log("GLB file uploaded to S3:", arFileUrl);
        // }
        // Generate custom productId like LOK-1234
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const productId = `LOK-${randomNumber}`;
        const payloadData = Object.assign(Object.assign({}, payload), { productId,
            imageUrls,
            arFileUrl });
        const result = yield product_model_1.default.create(payloadData);
        return result;
    }
    catch (error) {
        // Cleanup: If product creation fails, delete uploaded files
        if (arFileUrl) {
            // You might want to implement cleanup logic here
            console.error('Product creation failed, but files were uploaded:', error);
        }
        throw error;
    }
});
// Get all products
const getAllProducts = (keyword_1, category_1, minPrice_1, maxPrice_1, ...args_1) => __awaiter(void 0, [keyword_1, category_1, minPrice_1, maxPrice_1, ...args_1], void 0, function* (keyword, category, minPrice, maxPrice, page = 1, limit = 10) {
    const query = {};
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
        if (minPrice !== undefined)
            query["sizes.discountedPrice"].$gte = minPrice;
        if (maxPrice !== undefined)
            query["sizes.discountedPrice"].$lte = maxPrice;
    }
    // Pagination
    const skip = (page - 1) * limit;
    const [products, total] = yield Promise.all([
        product_model_1.default.find(query).skip(skip).limit(limit),
        product_model_1.default.countDocuments(query),
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
});
// Get single product by ID
const getSingleProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return result;
});
// Update product
const updateProduct = (id, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield product_model_1.default.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    let finalImageUrls = [];
    // Parse removedImageUrls if it's a string (from FormData)
    let removedImageUrls = payload.removedImageUrls;
    if (typeof removedImageUrls === 'string') {
        try {
            removedImageUrls = JSON.parse(removedImageUrls);
        }
        catch (error) {
            console.error("Failed to parse removedImageUrls", error);
            removedImageUrls = [];
        }
    }
    // Also parse existingImageUrls if it comes from frontend
    let frontendExistingImageUrls = payload.existingImageUrls;
    if (typeof frontendExistingImageUrls === 'string') {
        try {
            frontendExistingImageUrls = JSON.parse(frontendExistingImageUrls);
        }
        catch (error) {
            console.error("Failed to parse existingImageUrls", error);
            frontendExistingImageUrls = [];
        }
    }
    // Case 1: If frontend provided existingImageUrls, use those (after removals)
    if (frontendExistingImageUrls && frontendExistingImageUrls.length > 0) {
        // Start with the images frontend wants to keep
        finalImageUrls = [...frontendExistingImageUrls];
        // Remove any that are marked for deletion
        if (removedImageUrls && removedImageUrls.length > 0 && Array.isArray(removedImageUrls)) {
            finalImageUrls = finalImageUrls.filter((url) => !removedImageUrls.includes(url));
        }
    }
    // Case 2: No frontend existingImageUrls, use current images but remove specified ones
    else if (existing.imageUrls && existing.imageUrls.length > 0) {
        finalImageUrls = [...existing.imageUrls];
        if (removedImageUrls && removedImageUrls.length > 0 && Array.isArray(removedImageUrls)) {
            finalImageUrls = finalImageUrls.filter((url) => !removedImageUrls.includes(url));
        }
    }
    // Add new uploaded images
    if (files && files.length > 0) {
        const uploadedImages = yield Promise.all(files.map((file) => (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path)));
        const newImageUrls = uploadedImages.map((img) => img.secure_url);
        finalImageUrls = [...finalImageUrls, ...newImageUrls];
    }
    // Remove duplicates
    finalImageUrls = [...new Set(finalImageUrls)];
    // Delete removed images from Cloudinary to save storage
    if (removedImageUrls && removedImageUrls.length > 0 && Array.isArray(removedImageUrls)) {
        yield Promise.all(removedImageUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                // Extract public ID from Cloudinary URL
                const publicId = (_a = url.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (publicId) {
                    yield cloudinary_1.v2.uploader.destroy(publicId);
                }
                console.log(`Deleted image from Cloudinary: ${publicId}`);
            }
            catch (error) {
                console.error(`Failed to delete image from Cloudinary: ${url}`, error);
            }
        })));
    }
    // Remove the image-related fields from payload before updating
    const { removedImageUrls: _, existingImageUrls: __ } = payload, cleanPayload = __rest(payload, ["removedImageUrls", "existingImageUrls"]);
    const updatePayload = Object.assign(Object.assign({}, cleanPayload), { imageUrls: finalImageUrls });
    const result = yield product_model_1.default.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete product by ID
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Delete all product images from Cloudinary
    if (product.imageUrls && product.imageUrls.length > 0) {
        for (const url of product.imageUrls) {
            try {
                const parts = url.split("/");
                const filename = parts[parts.length - 1];
                const publicId = decodeURIComponent(filename.split(".")[0]);
                yield cloudinary_1.v2.uploader.destroy(publicId);
            }
            catch (err) {
                console.error("Error deleting Cloudinary image:", err);
            }
        }
    }
    // Delete product from DB
    const result = yield product_model_1.default.findByIdAndDelete(id);
    return result;
});
exports.ProductServices = {
    addProduct,
    getAllProducts,
    getSingleProductById,
    updateProduct,
    deleteProduct,
};
