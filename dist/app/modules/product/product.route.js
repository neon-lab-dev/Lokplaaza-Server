"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const auth_constannts_1 = require("../auth/auth.constannts");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// For admin only
router.post("/add", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), multer_config_1.multerUpload.array("files", 4), product_controller_1.ProductControllers.addProduct);
// Get all products
router.get("/", product_controller_1.ProductControllers.getAllProducts);
// Get single product by ID
router.get("/:productId", product_controller_1.ProductControllers.getSingleProductById);
// Update product
router.put("/update/:productId", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), multer_config_1.multerUpload.array("files", 4), product_controller_1.ProductControllers.updateProduct);
// Delete product
router.delete("/delete/:productId", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), product_controller_1.ProductControllers.deleteProduct);
exports.ProductRoutes = router;
