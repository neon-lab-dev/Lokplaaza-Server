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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_model_1 = require("../auth/auth.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = query.keyword || "";
    const role = query.role || "";
    const searchConditions = [];
    // 🔍 Keyword search on name and email
    if (keyword) {
        searchConditions.push({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
            ],
        });
    }
    // 🎭 Role filter
    if (role) {
        searchConditions.push({ role });
    }
    const whereCondition = searchConditions.length > 0 ? { $and: searchConditions } : {};
    // Fetch users
    const result = yield auth_model_1.User.find(whereCondition)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // optional: newest first
    // Total count for pagination
    const total = yield auth_model_1.User.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findById(userId);
    return result;
});
const updateProfile = (userId, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Check user
    const user = yield auth_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // ✅ Handle image upload
    if (file) {
        const imageName = `${userId}-${Date.now()}`;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, file.path);
        payload.imageUrl = secure_url;
    }
    // ✅ Update user with whatever comes
    const updatedUser = yield auth_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Profile update failed");
    }
    return updatedUser;
});
exports.UserServices = {
    getAllUsers,
    getMe,
    updateProfile
};
