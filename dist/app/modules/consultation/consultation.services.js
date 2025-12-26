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
exports.ConsultationServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const consultation_model_1 = __importDefault(require("./consultation.model"));
// Book Consultation
const bookConsultation = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield consultation_model_1.default.create(payload);
    return result;
});
// Get All Categories with search + pagination
const getAllConsultations = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [{ name: { $regex: keyword, $options: "i" } }];
        query.$or = [{ email: { $regex: keyword, $options: "i" } }];
        query.$or = [{ phoneNumber: { $regex: keyword, $options: "i" } }];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        consultation_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        consultation_model_1.default.countDocuments(query),
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
// Get Single Consultation
const getSingleConsultation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield consultation_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Consultation not found");
    }
    return result;
});
// Delete Consultation
const deleteConsultation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield consultation_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Consultation not found");
    }
    return result;
});
exports.ConsultationServices = {
    bookConsultation,
    getAllConsultations,
    getSingleConsultation,
    deleteConsultation,
};
