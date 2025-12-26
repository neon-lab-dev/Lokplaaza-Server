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
exports.InspirationRequestServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inspirationRequest_model_1 = __importDefault(require("./inspirationRequest.model"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const uploadInspirationImage = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Image is required");
    }
    // Upload image to Cloudinary
    const uploadedImage = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path);
    console.log(uploadedImage);
    const inspirationData = {
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        imageUrl: uploadedImage.secure_url,
    };
    const result = yield inspirationRequest_model_1.default.create(inspirationData);
    return result;
});
const getAllInspirationRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield inspirationRequest_model_1.default.find().sort({ createdAt: -1 });
    return result;
});
const deleteInspirationRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield inspirationRequest_model_1.default.findById(id);
    if (!exists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Inspiration request not found");
    }
    yield inspirationRequest_model_1.default.findByIdAndDelete(id);
    return null;
});
exports.InspirationRequestServices = {
    uploadInspirationImage,
    getAllInspirationRequests,
    deleteInspirationRequest,
};
