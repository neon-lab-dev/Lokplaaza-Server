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
exports.AdminServices = void 0;
const auth_model_1 = require("../auth/auth.model");
const category_model_1 = __importDefault(require("../category/category.model"));
const consultation_model_1 = __importDefault(require("../consultation/consultation.model"));
const customization_model_1 = __importDefault(require("../customization/customization.model"));
const inspirationRequest_model_1 = __importDefault(require("../inspirationRequest/inspirationRequest.model"));
const order_model_1 = require("../order/order.model");
const product_model_1 = __importDefault(require("../product/product.model"));
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, totalCategories, totalProducts, totalOrders, pendingOrders, totalInspirationRequests, totalConsultations, totalCustomizations,] = yield Promise.all([
        auth_model_1.User.countDocuments(),
        category_model_1.default.countDocuments(),
        product_model_1.default.countDocuments(),
        order_model_1.Order.countDocuments(),
        order_model_1.Order.countDocuments({ status: "pending" }),
        inspirationRequest_model_1.default.countDocuments(),
        consultation_model_1.default.countDocuments(),
        customization_model_1.default.countDocuments(),
    ]);
    return {
        totalUsers,
        totalCategories,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalInspirationRequests,
        totalConsultations,
        totalCustomizations,
    };
});
exports.AdminServices = {
    getAdminStats,
};
