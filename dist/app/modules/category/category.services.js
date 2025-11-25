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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const category_model_1 = __importDefault(require("./category.model"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
// Create Category
const addCategory = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield category_model_1.default.findOne({ name: payload.name });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Category already exists");
    }
    let imageUrl = "";
    if (file) {
        const imageName = `${payload.name}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const payloadData = Object.assign(Object.assign({}, payload), { imageUrl });
    return yield category_model_1.default.create(payloadData);
});
// Get All Categories with search + pagination
const getAllCategories = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        category_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        category_model_1.default.countDocuments(query),
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
});
// Get Single Category
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return result;
});
// Update Category
const updateCategory = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield category_model_1.default.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    let imageUrl;
    if (file) {
        const imageName = `${(payload === null || payload === void 0 ? void 0 : payload.name) || isExist.name}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const updatePayload = Object.assign(Object.assign({}, payload), (imageUrl && { imageUrl }));
    return yield category_model_1.default.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    });
});
// Delete Category
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return result;
});
exports.CategoryServices = {
    addCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
