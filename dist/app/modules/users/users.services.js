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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const auth_model_1 = require("../auth/auth.model");
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
exports.UserServices = {
    getAllUsers,
    getMe,
};
